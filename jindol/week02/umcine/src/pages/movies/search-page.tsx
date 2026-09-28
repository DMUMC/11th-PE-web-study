import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState, type SubmitEvent } from "react";
import { movies } from "../../data/movies";

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
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">영화 검색</h1>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3 sm:flex-row">
          <input
            aria-label="검색어"
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            placeholder="영화 제목 또는 원제 입력"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white"
          />
          <button
            type="submit"
            className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            검색
          </button>
        </form>
      </section>

      {!normalizedQuery ? (
        <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-slate-600">
          검색어를 입력해 주세요.
        </div>
      ) : (
        <section className="mt-8">
          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-xl font-semibold text-slate-900">‘{query}’ 검색 결과</h2>
            <span className="text-sm text-slate-500">영화 {searchResults.length}편</span>
          </div>

          {searchResults.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-slate-600">
              검색 결과가 없어요.
            </div>
          ) : (
            <ul className="grid gap-5 md:grid-cols-2">
              {searchResults.map((movie) => (
                <li key={movie.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <div className="flex gap-4 p-4">
                    <Link
                      to="/movies/$movieId"
                      params={{ movieId: String(movie.id) }}
                      className="shrink-0"
                    >
                      <img
                        src={movie.posterPath}
                        alt={`${movie.title} 포스터`}
                        className="h-40 w-28 rounded-xl object-cover"
                      />
                    </Link>

                    <div className="min-w-0 flex-1">
                      <Link to="/movies/$movieId" params={{ movieId: String(movie.id) }}>
                        <h3 className="text-lg font-semibold text-slate-900 hover:text-blue-600">
                          {movie.title}
                        </h3>
                      </Link>

                      <p className="mt-1 text-sm text-slate-500">{movie.originalTitle}</p>
                      <p className="mt-2 text-xs text-slate-400">{movie.releaseDate}</p>
                      <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">
                        {movie.overview}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </main>
  );
}
