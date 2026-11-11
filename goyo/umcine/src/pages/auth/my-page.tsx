
import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { HTTPError } from "ky";

import { getMyInfo } from "../../api/members/get-my-info";
import { updateMyInfo } from "../../api/members/update-my-info";
import { env } from "../../config/env";

import MovieCard from "../../components/movies/movie-card";
import { useBookmarkStore } from "../../stores/bookmark-store";

import type { TmdbMovieListItem } from "../../api/movies/model";

async function getBookmarkedMovie(
  movieId: number,
): Promise<TmdbMovieListItem> {
  const baseUrl = env.tmdbApiBaseUrl.replace(/\/$/, "");

  const response = await fetch(
    `${baseUrl}/movie/${movieId}?language=ko-KR`,
    {
      headers: {
        Authorization: `Bearer ${env.tmdbAccessToken}`,
        accept: "application/json",
      },
    },
  );

  if (!response.ok) {
    throw new Error("영화 정보를 불러오지 못했습니다.");
  }

  return response.json();
}

export function MyPage() {
  const navigate = useNavigate();

  const bookmarkIds = useBookmarkStore(
    (state) => state.bookmarkIds,
  );

  const toggleBookmark = useBookmarkStore(
    (state) => state.toggleBookmark,
  );

  const [isEditing, setIsEditing] = useState(false);
  const [nickname, setNickname] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  const {
    data: memberResponse,
    isPending: isMemberPending,
    isError: isMemberError,
    error: memberError,
    refetch: refetchMember,
  } = useQuery({
    queryKey: ["members", "me"],
    queryFn: getMyInfo,
    retry: false,
  });

  const member = memberResponse?.result;

  const {
    data: bookmarkedMovies = [],
    isPending: isMoviesPending,
    isError: isMoviesError,
    refetch: refetchMovies,
  } = useQuery({
    queryKey: ["bookmarked-movies", bookmarkIds],
    queryFn: () =>
      Promise.all(
        bookmarkIds.map((id) =>
          getBookmarkedMovie(Number(id)),
        ),
      ),
    enabled: bookmarkIds.length > 0,
  });

  useEffect(() => {
    if (
      isMemberError &&
      memberError instanceof HTTPError &&
      memberError.response.status === 401
    ) {
      localStorage.removeItem("accessToken");
      navigate({ to: "/login" });
    }
  }, [isMemberError, memberError, navigate]);

  useEffect(() => {
    if (member && !isEditing) {
      setNickname(member.nickname);
    }
  }, [member, isEditing]);

  const handleUpdateNickname = async () => {
    if (!member) return;

    const trimmedNickname = nickname.trim();

    if (
      trimmedNickname.length < 2 ||
      trimmedNickname.length > 12
    ) {
      setSaveError("닉네임은 2~12자로 입력해주세요.");
      return;
    }

    if (trimmedNickname === member.nickname) {
      setIsEditing(false);
      return;
    }

    setIsSaving(true);
    setSaveError("");

    try {
      const response = await updateMyInfo({
        nickname: trimmedNickname,
      });

      alert(response.message);
      await refetchMember();
      setIsEditing(false);
    } catch {
      setSaveError("닉네임 수정에 실패했습니다.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setNickname(member?.nickname ?? "");
    setSaveError("");
    setIsEditing(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    navigate({ to: "/login" });
  };

  if (isMemberPending) {
    return (
      <main className="flex min-h-[calc(100vh-58px)] items-center justify-center bg-[#F7F8FA]">
        <p className="text-sm text-[#606774]">
          회원 정보를 불러오는 중입니다.
        </p>
      </main>
    );
  }

  if (isMemberError || !member) {
    return (
      <main className="flex min-h-[calc(100vh-58px)] flex-col items-center justify-center gap-4 bg-[#F7F8FA]">
        <p className="text-sm text-[#606774]">
          회원 정보를 불러오지 못했습니다.
        </p>

        <button
          type="button"
          onClick={() => refetchMember()}
          className="rounded-md bg-[#2563EB] px-5 py-2 text-sm text-white"
        >
          다시 시도
        </button>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-58px)] bg-[#F7F8FA] px-4 py-8 sm:px-8 lg:px-20">
      <div className="mx-auto w-full max-w-[1440px]">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-[30px] font-bold text-[#17191E]">
            내 정보
          </h1>

          <button
            type="button"
            onClick={handleLogout}
            className="rounded-md border border-[#E5E7EB] bg-white px-4 py-2 text-[13px] text-[#606774] hover:bg-[#F3F4F6]"
          >
            로그아웃
          </button>
        </div>

        <section className="mb-12 rounded-xl border border-[#E5E7EB] bg-white p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="flex h-[76px] w-[76px] shrink-0 items-center justify-center rounded-full bg-[#F1F3F6]">
              <svg
                width="36"
                height="36"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#606774"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="8" r="4" />
                <path d="M4 21a8 8 0 0 1 16 0" />
              </svg>
            </div>

            <div className="min-w-0 flex-1">
              <p className="mb-1 text-[12px] text-[#969DA8]">
                닉네임
              </p>

              {isEditing ? (
                <div className="flex flex-wrap items-center gap-2">
                  <input
                    type="text"
                    value={nickname}
                    maxLength={12}
                    disabled={isSaving}
                    onChange={(e) =>
                      setNickname(e.target.value)
                    }
                    className="h-[38px] min-w-0 rounded-md border border-[#D1D5DB] px-3 text-sm outline-none focus:border-[#2563EB]"
                  />

                  <button
                    type="button"
                    disabled={isSaving}
                    onClick={handleUpdateNickname}
                    className="h-[38px] rounded-md bg-[#2563EB] px-4 text-[12px] font-semibold text-white disabled:opacity-50"
                  >
                    {isSaving ? "저장 중" : "저장"}
                  </button>

                  <button
                    type="button"
                    disabled={isSaving}
                    onClick={handleCancelEdit}
                    className="h-[38px] rounded-md border border-[#E5E7EB] px-4 text-[12px]"
                  >
                    취소
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <h2 className="text-[20px] font-bold text-[#17191E]">
                    {member.nickname}
                  </h2>

                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="rounded-md border border-[#E5E7EB] px-3 py-1.5 text-[12px] font-semibold text-[#2563EB]"
                  >
                    수정
                  </button>
                </div>
              )}

              {saveError && (
                <p className="mt-2 text-[12px] text-red-500">
                  {saveError}
                </p>
              )}

              <p className="mt-2 break-all text-[13px] text-[#969DA8]">
                {member.email}
              </p>
            </div>
          </div>
        </section>

        <section>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-[24px] font-bold text-[#17191E]">
              내가 북마크한 영화
            </h2>

            <span className="text-[13px] text-[#969DA8]">
              총 {bookmarkIds.length}개
            </span>
          </div>

          {bookmarkIds.length === 0 ? (
            <div className="flex min-h-[220px] flex-col items-center justify-center rounded-xl border border-[#E5E7EB] bg-white">
              <p className="text-[14px] text-[#606774]">
                아직 북마크한 영화가 없습니다.
              </p>
            </div>
          ) : isMoviesPending ? (
            <div className="flex min-h-[220px] items-center justify-center">
              <p className="text-sm text-[#606774]">
                북마크한 영화를 불러오는 중입니다.
              </p>
            </div>
          ) : isMoviesError ? (
            <div className="flex min-h-[220px] flex-col items-center justify-center gap-4">
              <p className="text-sm text-[#606774]">
                영화 정보를 불러오지 못했습니다.
              </p>

              <button
                type="button"
                onClick={() => refetchMovies()}
                className="rounded-md bg-[#2563EB] px-4 py-2 text-sm text-white"
              >
                다시 시도
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {bookmarkedMovies.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  isBookmarked={bookmarkIds.includes(movie.id)}
                  onToggleBookmark={toggleBookmark}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
