import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState, type SubmitEvent } from "react";
import { movies } from "../../data/movies";
import { BookmarkButton } from "../../components/bookmark-button";

export function SearchPage() {
  const { query } = useSearch({ from: "/search" });
  const navigate = useNavigate({ from: "/search" });
  const [searchText, setSearchText] = useState(query ?? "");

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
          className="flex-1 rounded-[6px] border border-gray-300 px-4 py-3 outline-none focus:border-[#5267e9]"
          aria-label="검색어"
          placeholder="검색어를 입력하세요"
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
        />
        <button
          className="rounded-[6px] bg-[#5267e9] px-5 py-3 text-white cursor-pointer hover:bg-[#4355c9] transition-colors"
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
                  className="overflow-hidden rounded-[10px] bg-white border border-gray-100 shadow-sm flex flex-col justify-between"
                  key={movie.id}
                >
                  <div className="relative overflow-hidden">
                    <Link
                      to="/movies/$movieId"
                      params={{ movieId: String(movie.id) }}
                    >
                      <img
                        className="aspect-[2/3] w-full object-cover transition-transform duration-300 hover:scale-105"
                        src={movie.posterPath}
                        alt={`${movie.title} 포스터`}
                      />
                    </Link>
                    <div className="absolute right-2 top-2">
                      <BookmarkButton movieId={movie.id} variant="badge" />
                    </div>
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="mb-1 text-lg font-semibold">
                        <Link
                          to="/movies/$movieId"
                          params={{ movieId: String(movie.id) }}
                          className="hover:text-[#5267e9] transition-colors"
                        >
                          {movie.title}
                        </Link>
                      </h3>
                      <p className="mb-1 text-sm text-gray-500">
                        {movie.originalTitle}
                      </p>
                      <p className="mb-3 text-sm text-gray-500">
                        {movie.releaseDate}
                      </p>
                      <p className="mb-4 text-sm leading-6 line-clamp-3 text-gray-700">
                        {movie.overview}
                      </p>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-2">
                      <Link
                        className="text-sm font-semibold text-[#5267e9] hover:underline"
                        to="/movies/$movieId"
                        params={{ movieId: String(movie.id) }}
                      >
                        상세 보기
                      </Link>
                      <BookmarkButton movieId={movie.id} />
                    </div>
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

export default SearchPage;
