import { useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState, type SubmitEvent } from "react";
import { movies } from "../../data/movies";
import MovieCard from "../../components/movies/movie-card";

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

  function handleClear() {
    setSearchText("");

    navigate({
      search: {},
    });
  }

  if (!normalizedQuery) {
    return (
      <main className="min-h-[calc(100vh-64px)] bg-[#F6F7F9] font-[Pretendard,sans-serif]">
        <section className="flex min-h-[510px] w-full items-center justify-center px-5">
          <div className="w-full max-w-[800px]">
            <h1 className="mb-10 text-center text-[38px] font-bold leading-[44px] text-[#17191E] max-sm:text-[28px]">
              어떤 영화를 찾고 있나요?
            </h1>

            <form
              onSubmit={handleSubmit}
              className="flex h-[72px] w-full items-center rounded-[16px] border border-[#17191E] bg-white px-4 shadow-[0_8px_24px_rgba(23,25,30,0.08)]"
            >
              <img
                src="/movie-icons/search.svg"
                alt=""
                className="mr-3 h-6 w-6 shrink-0"
              />

              <input
                type="text"
                aria-label="검색어"
                placeholder="예: 스파이더맨"
                value={searchText}
                onChange={(event) => setSearchText(event.target.value)}
                className="min-w-0 flex-1 border-0 bg-transparent text-sm text-[#17191E] outline-none placeholder:text-[#969DA8]"
              />

              <button
                type="submit"
                className="ml-3 h-[42px] shrink-0 cursor-pointer rounded-lg border-0 bg-[#17191E] px-5 text-sm font-bold text-white"
              >
                검색
              </button>
            </form>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-64px)] bg-[#F6F7F9] font-[Pretendard,sans-serif]">
      <section className="mx-auto w-full max-w-[1440px] px-5 py-6 sm:px-10 lg:px-20">
        <h1 className="mb-5 text-[28px] font-bold leading-[34px] text-[#17191E]">
          영화 검색
        </h1>

        <form
          onSubmit={handleSubmit}
          className="flex h-[52px] w-full items-center rounded-lg border border-[#E3E6EB] bg-white px-4"
        >
          <img
            src="/movie-icons/search.svg"
            alt=""
            className="mr-3 h-5 w-5 shrink-0"
          />

          <input
            type="text"
            aria-label="검색어"
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            className="min-w-0 flex-1 border-0 bg-transparent text-sm font-medium text-[#17191E] outline-none placeholder:text-[#969DA8]"
          />

          {searchText && (
            <button
              type="button"
              onClick={handleClear}
              aria-label="검색어 지우기"
              className="mr-4 flex h-6 w-6 cursor-pointer items-center justify-center border-0 bg-transparent p-0"
            >
              <img
                src="/movie-icons/close.svg"
                alt=""
                className="h-4 w-4"
              />
            </button>
          )}

          <button
            type="submit"
            className="h-[36px] shrink-0 cursor-pointer rounded-lg border-0 bg-[#17191E] px-4 text-xs font-bold text-white"
          >
            다시 검색
          </button>
        </form>

        <div className="mt-5 flex items-center justify-between border-b border-[#E3E6EB] pb-4">
          <h2 className="text-[20px] font-bold text-[#17191E] sm:text-[22px]">
            ‘{query}’ 검색 결과
          </h2>

          <p className="m-0 text-xs font-normal text-[#969DA8]">
            영화 {searchResults.length}편
          </p>
        </div>

        {searchResults.length === 0 ? (
          <div className="flex min-h-[320px] items-center justify-center">
            <p className="text-sm text-[#606774]">
              검색 결과가 없어요.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-x-10">
            {searchResults.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                variant="search"
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default SearchPage;