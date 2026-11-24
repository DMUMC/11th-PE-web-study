
import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { getMovies } from "../../api/movies/get-movies";
import {
  createFavorite,
  deleteFavorite,
  getFavorites,
} from "../../api/favorites";

import MovieGrid from "../../components/movies/movie-grid";
import Pagination from "../../components/movies/pagination";
import { useAuthStore } from "../../stores/auth-store";

export default function MovieListPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const accessToken = useAuthStore(
    (state) => state.accessToken,
  );

  const isLoggedIn = Boolean(accessToken);
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data,
    isPending,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["movies", "list", currentPage],
    queryFn: () => getMovies({ page: currentPage }),
  });

  const {
    data: favoritesResponse,
    isPending: isFavoritesPending,
    isError: isFavoritesError,
  } = useQuery({
    queryKey: ["favorites", accessToken],
    queryFn: getFavorites,
    enabled: isLoggedIn,
    retry: false,
  });

  const bookmarkedIds = isLoggedIn
    ? (favoritesResponse?.result ?? []).map(
        (favorite) => favorite.movieId,
      )
    : [];

  const favoriteMutation = useMutation({
    mutationFn: async (movieId: number) => {
      if (bookmarkedIds.includes(movieId)) {
        await deleteFavorite(movieId);
      } else {
        await createFavorite(movieId);
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["favorites"],
      });
    },
    onError: () => {
      alert("북마크 처리에 실패했습니다.");
    },
  });

  const movies = data?.results ?? [];
  const totalPages = Math.min(data?.total_pages ?? 1, 500);

  function handleToggleBookmark(movieId: number) {
    if (!isLoggedIn) {
      alert("로그인이 필요한 기능입니다.");
      void navigate({ to: "/login" });
      return;
    }

    if (isFavoritesPending || favoriteMutation.isPending) {
      return;
    }

    if (isFavoritesError) {
      alert("북마크 정보를 불러오지 못했습니다.");
      return;
    }

    favoriteMutation.mutate(movieId);
  }

  function handlePageChange(page: number) {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <main className="min-h-screen bg-[#F6F7F9] px-4 py-6 sm:px-8 lg:px-20">
      <div className="mx-auto w-full max-w-[1440px]">
        <h1 className="mb-5 text-[38px] font-bold leading-[44px] text-[#17191E]">
          영화 목록
        </h1>

        {isPending ? (
          <div className="flex min-h-[400px] items-center justify-center">
            <p className="text-sm text-[#606774]">
              영화를 불러오는 중이에요...
            </p>
          </div>
        ) : isError ? (
          <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
            <p className="text-sm text-[#606774]">
              영화 목록을 불러오지 못했어요.
            </p>
            <button
              type="button"
              onClick={() => void refetch()}
              className="cursor-pointer rounded-lg bg-[#17191E] px-5 py-3 text-sm font-bold text-white"
            >
              다시 시도
            </button>
          </div>
        ) : movies.length === 0 ? (
          <div className="flex min-h-[400px] items-center justify-center">
            <p className="text-sm text-[#606774]">
              등록된 영화가 없어요.
            </p>
          </div>
        ) : (
          <>
            <MovieGrid
              movies={movies}
              bookmarkedIds={bookmarkedIds}
              onToggleBookmark={handleToggleBookmark}
            />

            <div className="mt-8">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          </>
        )}
      </div>
    </main>
  );
}
