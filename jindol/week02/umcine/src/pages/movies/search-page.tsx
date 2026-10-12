import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState, type SubmitEvent } from "react";
import { searchMovies } from "../../api/movies/search-movies";
import type { TmdbMovieListItem } from "../../api/movies/models";
import { getTmdbPosterUrl } from "../../utils/movies/tmdb-image";

export function SearchPage() {
  const { query } = useSearch({ from: "/search" });
  const navigate = useNavigate({ from: "/search" });
  const [movies, setMovies] = useState<TmdbMovieListItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const normalizedQuery = query?.trim() ?? "";

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    let ignore = false;
    const normalizedQuery = query?.trim() ?? "";

    setMovies([]);
    setErrorMessage(null);

    if (!normalizedQuery) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    searchMovies({ query: normalizedQuery })
      .then((response) => {
        if (!ignore) setMovies(response.results);
      })
      .catch(() => {
        if (!ignore) setErrorMessage("검색 결과를 불러오지 못했어요.");
      })
      .finally(() => {
        if (!ignore) setIsLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [query]);
  /* eslint-enable react-hooks/set-state-in-effect */

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const nextQuery = String(formData.get("query") ?? "").trim();
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
            key={query ?? ""}
            name="query"
            defaultValue={query ?? ""}
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
            <span className="text-sm text-slate-500">영화 {movies.length}편</span>
          </div>

          {isLoading ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-slate-600">
              검색 중이에요...
            </div>
          ) : errorMessage ? (
            <div role="alert" className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-slate-600">
              {errorMessage}
            </div>
          ) : movies.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-slate-600">
              검색 결과가 없어요.
            </div>
          ) : (
            <ul className="grid gap-5 md:grid-cols-2">
              {movies.map((movie) => {
                const posterUrl = getTmdbPosterUrl(movie.poster_path);

                return (
                  <li key={movie.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="flex gap-4 p-4">
                      <Link
                        to="/movies/$movieId"
                        params={{ movieId: String(movie.id) }}
                        className="shrink-0"
                      >
                        {posterUrl ? (
                          <img
                            src={posterUrl}
                            alt={`${movie.title} 포스터`}
                            className="h-40 w-28 rounded-xl object-cover"
                          />
                        ) : (
                          <div className="flex h-40 w-28 items-center justify-center rounded-xl bg-slate-100 text-center text-xs text-slate-500">
                            포스터 없음
                          </div>
                        )}
                      </Link>

                      <div className="min-w-0 flex-1">
                        <Link to="/movies/$movieId" params={{ movieId: String(movie.id) }}>
                          <h3 className="text-lg font-semibold text-slate-900 hover:text-blue-600">
                            {movie.title}
                          </h3>
                        </Link>

                        <p className="mt-1 text-sm text-slate-500">{movie.original_title}</p>
                        <p className="mt-2 text-xs text-slate-400">{movie.release_date}</p>
                        <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">
                          {movie.overview}
                        </p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      )}
    </main>
  );
}
