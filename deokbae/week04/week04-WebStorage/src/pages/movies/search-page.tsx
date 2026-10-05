import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useState, type SubmitEvent } from "react";
import { movies } from "../../data/movie";
import "../../App.css";


export function SearchPage() {
  const { query } = useSearch({ from: "/search" });
  const navigate = useNavigate({ from: "/search" });
  const [searchText, setSearchText] = useState(query ?? "");
   const [prevQuery, setPrevQuery] = useState(query);

    if (query !== prevQuery) {
    setPrevQuery(query);
    setSearchText(query ?? "");
  }

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
    <main className="mx-auto flex max-w-6xl flex-col items-center px-12 pb-20 pt-32">
      <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
        어떤 영화를 찾고 있나요?
      </h1>

      <form
        onSubmit={handleSubmit}
        role="search"
        className="mt-8 flex w-full max-w-3xl items-center gap-3 rounded-xl border-2 border-slate-900 bg-white px-4 py-3 shadow-xl shadow-slate-900/10"
      >
        <img
          src="/icons/movie-icons/search.svg"
          alt=""
          aria-hidden="true"
          className="size-5 shrink-0"
        />
        <input
          aria-label="검색어"
          placeholder="예: 스파이더맨"
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
          className="min-w-0 flex-1 bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
        />
        <button
          type="submit"
          className="shrink-0 rounded-md bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800"
        >
          검색
        </button>
      </form>

      {!normalizedQuery ? (
        <p className="mt-6 text-sm text-slate-500">검색어를 입력해 주세요.</p>
      ) : (
        <section className="mt-12 w-full max-w-3xl">
          <h2 className="text-lg font-bold text-slate-900">‘{query}’ 검색 결과</h2>
          <p className="mt-1 text-xs text-slate-500">
            영화 {searchResults.length}편
          </p>

          {searchResults.length === 0 ? (
            <p className="mt-10 text-center text-sm text-slate-500">
              검색 결과가 없어요.
            </p>
          ) : (
            <ul className="mt-5 flex flex-col gap-4">
              {searchResults.map((movie) => (
                <li
                  key={movie.id}
                  className="flex gap-5 rounded-xl border border-slate-200 bg-white p-4"
                >
                  <img
                    src={movie.posterPath}
                    alt={`${movie.title} 포스터`}
                    className="h-[150px] w-[104px] shrink-0 rounded-md object-cover"
                  />
                  <div className="flex min-w-0 flex-1 flex-col">
                    <h3 className="text-base font-bold text-slate-900">
                      {movie.title}
                    </h3>
                    <p className="text-xs text-slate-500">{movie.originalTitle}</p>
                    <p className="mt-1 text-xs text-slate-400">
                      {movie.releaseDate}
                    </p>
                    <p className="mt-3 line-clamp-3 text-xs leading-relaxed text-slate-600">
                      {movie.overview}
                    </p>
                    <Link
                      to="/movies/$movieId"
                      params={{ movieId: String(movie.id) }}
                      className="mt-auto w-fit pt-3 text-xs font-bold text-blue-600 hover:underline"
                    >
                      상세 보기
                    </Link>
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
