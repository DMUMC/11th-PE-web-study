import {
  Link,
  useNavigate,
  useSearch,
} from "@tanstack/react-router";

import { useState, type SubmitEvent } from "react";
import { movies } from "../../data/movies";

export function SearchPage() {
  const { query } = useSearch({ from: "/search" });

  return <SearchContent key={query ?? ""} query={query} />;
}

function SearchContent({ query }: { query?: string }) {
  const navigate = useNavigate({ from: "/search" });
  const [searchText, setSearchText] = useState(query ?? "");
  const normalizedQuery = query?.trim().toLowerCase() ?? "";

  const results = normalizedQuery
    ? movies.filter(
        (movie) =>
          movie.title.toLowerCase().includes(normalizedQuery) ||
          movie.originalTitle.toLowerCase().includes(normalizedQuery),
      )
    : [];

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextQuery = searchText.trim();

    void navigate({
      to: "/search",
      search: nextQuery ? { query: nextQuery } : {},
    });
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="mb-8 text-3xl font-bold">영화 검색</h1>

      <form
        onSubmit={handleSubmit}
        className="mb-8 flex flex-wrap gap-3"
      >
        <label htmlFor="movie-search" className="sr-only">
          영화 검색어
        </label>

        <input
          id="movie-search"
          type="search"
          placeholder="영화 제목이나 원제를 입력하세요."
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
          className="min-w-0 flex-1 rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />

        <button
          type="submit"
          className="cursor-pointer rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
        >
          검색
        </button>
      </form>

      {!normalizedQuery ? (
        <p className="py-12 text-center text-slate-500">
          검색어를 입력해 주세요.
        </p>
      ) : (
        <>
          <h2 className="text-xl font-bold">
            ‘{query?.trim()}’ 검색 결과
          </h2>

          <p className="mb-6 mt-2 text-slate-500">
            영화 {results.length}편
          </p>

          {results.length === 0 ? (
            <p className="py-12 text-center text-slate-500">
              검색 결과가 없어요.
            </p>
          ) : (
            <ul className="space-y-5">
              {results.map((movie) => (
                <li
                  key={movie.id}
                  className="flex flex-col gap-5 rounded-xl border border-slate-200 bg-white p-5 sm:flex-row"
                >
                  <Link
                    to="/movies/$movieId"
                    params={{ movieId: String(movie.id) }}
                    className="w-36 shrink-0"
                  >
                    <img
                      src={movie.posterPath}
                      alt={`${movie.title} 포스터`}
                      className="aspect-[2/3] w-full rounded-lg object-cover"
                    />
                  </Link>

                  <div className="min-w-0 space-y-3">
                    <Link
                      to="/movies/$movieId"
                      params={{ movieId: String(movie.id) }}
                      className="text-xl font-bold hover:text-blue-600"
                    >
                      {movie.title}
                    </Link>

                    <p className="text-sm text-slate-500">
                      원제: {movie.originalTitle}
                    </p>

                    <p className="text-sm text-slate-500">
                      개봉일: {movie.releaseDate}
                    </p>

                    <p className="leading-relaxed text-slate-700">
                      {movie.overview}
                    </p>
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