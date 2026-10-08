import { useBookmarkStore } from "../../stores/bookmark-store";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState, type SubmitEvent } from "react";
import { movies } from "../../data/movies";

export function SearchPage() {
  const { query } = useSearch({ from: "/search" });
  const navigate = useNavigate({ from: "/search" });
  const [searchText, setSearchText] = useState(query ?? "");

  const bookmarkedMovieIds = useBookmarkStore(
    (state) => state.bookmarkedMovieIds,
  );

  const toggleBookmark = useBookmarkStore(
    (state) => state.toggleBookmark,
  );

  useEffect(() => {
    setSearchText(query ?? "");
  }, [query]);

  const normalizedQuery = query?.trim().toLowerCase() ?? "";

  const searchResults = normalizedQuery
    ? movies.filter(
        (movie) =>
          movie.title.toLowerCase().includes(normalizedQuery) ||
          movie.originalTitle.toLowerCase().includes(normalizedQuery),
      )
    : [];

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextQuery = searchText.trim();

    navigate({
      search: nextQuery ? { query: nextQuery } : {},
    });
  }

  return (
    <main className="mx-auto w-full max-w-[1280px] px-10 py-10">
      <h1 className="mb-6 text-[28px] font-bold">영화 검색</h1>

      <form
        className="mb-8 flex max-w-[520px] gap-3"
        onSubmit={handleSubmit}
      >
        <input
          className="flex-1 rounded-[6px] border border-gray-300 px-4 py-3 outline-none"
          aria-label="검색어"
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
        />

        <button
          className="rounded-[6px] bg-[#5267e9] px-5 py-3 text-white"
          type="submit"
        >
          검색
        </button>
      </form>

      {!normalizedQuery ? (
        <p className="text-gray-500">검색어를 입력해 주세요.</p>
      ) : (
        <>
          <h2 className="mb-2 text-xl font-semibold">
            ‘{query}’ 검색 결과
          </h2>

          <p className="mb-6 text-sm text-gray-500">
            영화 {searchResults.length}편
          </p>

          {searchResults.length === 0 ? (
            <p className="text-gray-500">검색 결과가 없어요.</p>
          ) : (
            <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {searchResults.map((movie) => (
                <li
                  className="overflow-hidden rounded-[10px] bg-white"
                  key={movie.id}
                >
                  <img
                    className="aspect-[2/3] w-full object-cover"
                    src={movie.posterPath}
                    alt={`${movie.title} 포스터`}
                  />

                  <div className="p-4">
                    <h3 className="mb-1 text-lg font-semibold">
                      {movie.title}
                    </h3>

                    <p className="mb-1 text-sm text-gray-500">
                      {movie.originalTitle}
                    </p>

                    <p className="mb-3 text-sm text-gray-500">
                      {movie.releaseDate}
                    </p>

                    <p className="mb-4 text-sm leading-6">
                      {movie.overview}
                    </p>

                    <button
                      className="mr-3 mb-3 rounded-[6px] bg-[#5267e9] px-4 py-2 text-sm text-white"
                      type="button"
                      onClick={() => toggleBookmark(movie.id)}
                    >
                      {bookmarkedMovieIds.includes(movie.id)
                        ? "북마크 해제"
                        : "북마크 추가"}
                    </button>

                    <Link
                      className="text-sm font-semibold text-[#5267e9]"
                      to="/movies/$movieId"
                      params={{ movieId: String(movie.id) }}
                    >
                      상세 보기
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </main>
  );
}