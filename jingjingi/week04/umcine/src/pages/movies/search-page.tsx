import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { movies } from "../../data/movies";
import type { Movie } from "../../types/movie";
import { BookmarkButton } from "../../components/movies/bookmark-button";

function SearchIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="6" />
      <path d="m16 16 4 4" />
    </svg>
  );
}

function SearchResultCard({ movie }: { movie: Movie }) {
  return (
    <article className="flex gap-5 border-b border-slate-200 pb-7">
      <Link to="/movies/$movieId" params={{ movieId: String(movie.id) }} className="shrink-0">
        <img
          src={movie.posterPath}
          alt={`${movie.title} 포스터`}
          className="h-40 w-28 rounded-lg object-cover shadow-sm transition hover:opacity-90"
        />
      </Link>
      <div className="min-w-0 flex-1 py-1">
        <Link
          to="/movies/$movieId"
          params={{ movieId: String(movie.id) }}
          className="text-lg font-black text-slate-950 hover:text-brand-600"
        >
          {movie.title}
        </Link>
        <p className="mt-1 text-sm text-slate-500">{movie.originalTitle}</p>
        <p className="mt-1 text-xs text-slate-400">{movie.releaseDate}</p>
        <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-600">{movie.overview}</p>
        <div className="mt-4 flex items-center gap-4">
          <Link
            to="/movies/$movieId"
            params={{ movieId: String(movie.id) }}
            className="text-sm font-bold text-brand-600 hover:text-brand-500"
          >
            상세 보기 →
          </Link>
          <BookmarkButton movieId={movie.id} variant="text" className="px-3 py-2" />
        </div>
      </div>
    </article>
  );
}

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

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextQuery = searchText.trim();

    navigate({
      to: "/search",
      search: nextQuery ? { query: nextQuery } : {},
    });
  }

  return (
    <main className="min-h-[calc(100vh-8rem)] bg-slate-50">
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
        <h1 className="text-3xl font-black tracking-tight text-slate-950">영화 검색</h1>

        <form onSubmit={handleSubmit} className="mt-6 flex rounded-xl border border-slate-300 bg-white p-1.5 shadow-sm focus-within:border-brand-500 focus-within:ring-4 focus-within:ring-brand-500/10">
          <label className="flex min-w-0 flex-1 items-center gap-3 px-3">
            <SearchIcon />
            <span className="sr-only">검색어</span>
            <input
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              placeholder="영화 제목이나 원제를 검색해 보세요."
              className="h-10 min-w-0 flex-1 border-0 bg-transparent text-sm outline-none placeholder:text-slate-400"
            />
          </label>
          {searchText && (
            <button
              type="button"
              onClick={() => setSearchText("")}
              aria-label="검색어 지우기"
              className="px-3 text-slate-400 hover:text-slate-700"
            >
              ×
            </button>
          )}
          <button type="submit" className="rounded-lg bg-slate-950 px-5 text-sm font-bold text-white hover:bg-slate-800">
            검색하기
          </button>
        </form>

        {!normalizedQuery ? (
          <section className="grid min-h-[55vh] place-items-center text-center">
            <div>
              <div className="mx-auto mb-5 grid size-16 place-items-center rounded-full bg-white text-slate-400 shadow-sm">
                <SearchIcon />
              </div>
              <h2 className="text-2xl font-black text-slate-900">어떤 영화를 찾고 있나요?</h2>
              <p className="mt-3 text-sm text-slate-500">제목이나 원제를 입력해 검색해 보세요.</p>
            </div>
          </section>
        ) : (
          <section className="mt-8">
            <div className="mb-6 flex items-end justify-between">
              <div>
                <h2 className="text-xl font-black text-slate-950">‘{query}’ 검색 결과</h2>
                <p className="mt-1 text-sm text-slate-500">영화 {searchResults.length}편</p>
              </div>
            </div>

            {searchResults.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-24 text-center">
                <p className="text-lg font-bold text-slate-800">검색 결과가 없어요.</p>
                <p className="mt-2 text-sm text-slate-500">다른 검색어를 입력해 보세요.</p>
              </div>
            ) : (
              <div className="grid gap-x-10 gap-y-7 lg:grid-cols-2">
                {searchResults.map((movie) => (
                  <SearchResultCard key={movie.id} movie={movie} />
                ))}
              </div>
            )}
          </section>
        )}
      </div>
    </main>
  );
}
