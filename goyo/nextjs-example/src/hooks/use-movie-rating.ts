
import { useEffect, useState } from "react";
import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { HTTPError } from "ky";

import {
  createRating,
  updateRating,
  deleteRating,
} from "../api/ratings";
import type { Rating } from "../api/ratings";
import { useAuthStore } from "../stores/auth-store";

function getRatingStorageKey(movieId: number) {
  return `umcine-rating-${movieId}`;
}

function readSavedRating(movieId: number): Rating | null {
  try {
    const saved = localStorage.getItem(
      getRatingStorageKey(movieId),
    );

    if (!saved) return null;

    const parsed = JSON.parse(saved) as Rating;

    if (
      typeof parsed.ratingId !== "number" ||
      Number(parsed.movieId) !== movieId
    ) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

function saveRatingToStorage(rating: Rating) {
  localStorage.setItem(
    getRatingStorageKey(rating.movieId),
    JSON.stringify(rating),
  );
}

function removeRatingFromStorage(movieId: number) {
  localStorage.removeItem(
    getRatingStorageKey(movieId),
  );
}

export function useMovieRating(movieId: number) {
  const queryClient = useQueryClient();

  const accessToken = useAuthStore(
    (state) => state.accessToken,
  );

  const isLoggedIn = Boolean(accessToken);

  const [myRating, setMyRating] = useState<Rating | null>(
    null,
  );

  const [errorMessage, setErrorMessage] = useState("");

  // 저장된 평점 불러오기
  useEffect(() => {
    if (!isLoggedIn) {
      setMyRating(null);
      return;
    }

    const savedRating = readSavedRating(movieId);
    setMyRating(savedRating);
    setErrorMessage("");
  }, [movieId, isLoggedIn]);

  // 평점 등록 및 수정
  const saveMutation = useMutation({
    mutationFn: async ({
      score,
      comment,
    }: {
      score: number;
      comment?: string;
    }) => {
      if (!isLoggedIn) {
        throw new Error("로그인이 필요합니다.");
      }

      if (score < 1 || score > 5) {
        throw new Error("별점은 1점부터 5점까지 선택해주세요.");
      }

      const body = {
        score,
        comment: comment ?? "",
      };

      // 기존 평점이 있으면 수정
      if (myRating) {
        return updateRating(myRating.ratingId, body);
      }

      // 기존 평점이 없으면 등록
      return createRating({
        movieId,
        ...body,
      });
    },

    onSuccess: async (response, variables) => {
      const result = response.result;

      if (result) {
        const nextRating: Rating = {
          ...result,
          movieId,
          score: variables.score,
          comment: variables.comment ?? "",
        };

        setMyRating(nextRating);
        saveRatingToStorage(nextRating);

        queryClient.setQueryData(
          ["ratings", "movie", movieId],
          nextRating,
        );
      }

      await queryClient.invalidateQueries({
        queryKey: ["ratings", "member"],
      });

      setErrorMessage("");
    },

    onError: (error) => {
      if (error instanceof HTTPError) {
        if (error.response.status === 409) {
          setErrorMessage(
            "이미 등록된 평점이 있습니다. 기존 평점 ID를 확인할 수 없어 수정할 수 없습니다.",
          );
          return;
        }

        if (error.response.status === 401) {
          setErrorMessage(
            "로그인이 만료되었습니다. 다시 로그인해주세요.",
          );
          return;
        }

        setErrorMessage(
          `평점 저장에 실패했습니다. (${error.response.status})`,
        );
        return;
      }

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "평점 저장에 실패했습니다.",
      );
    },
  });

  // 평점 삭제
  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (!isLoggedIn) {
        throw new Error("로그인이 필요합니다.");
      }

      if (!myRating) {
        throw new Error("삭제할 평점이 없습니다.");
      }

      await deleteRating(myRating.ratingId);
    },

    onSuccess: async () => {
      removeRatingFromStorage(movieId);

      queryClient.removeQueries({
        queryKey: ["ratings", "movie", movieId],
      });

      await queryClient.invalidateQueries({
        queryKey: ["ratings", "member"],
      });

      setMyRating(null);
      setErrorMessage("");
    },

    onError: (error) => {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "평점 삭제에 실패했습니다.",
      );
    },
  });

  return {
    myRating,
    ratings: myRating ? [myRating] : [],
    isLoading: false,
    isError: Boolean(errorMessage),
    errorMessage,
    isSaving: saveMutation.isPending,
    isDeleting: deleteMutation.isPending,

    // 기존 사용 방식 유지: saveRating(3)
    // 후기 포함 시: saveRating({ score: 3, comment: "좋아요" })
    saveRating: (
      value:
        | number
        | { score: number; comment?: string },
    ) => {
      const payload =
        typeof value === "number"
          ? { score: value }
          : value;

      saveMutation.mutate(payload);
    },

    removeRating: () => {
      deleteMutation.mutate();
    },
  };
}
