import { useNavigate, useSearch } from "@tanstack/react-router";
import { useCallback, useState, type SubmitEvent } from "react";
import { searchMovies } from "../../api/movies/search-movies";
import { useMovieRequest } from "../../hooks/use-movie-request";
import { RequestMessage } from "../../components/movies/request-message";
import MovieCard from "../../components/movies/movie-card";

export function SearchPage() {
  const { query } = useSearch({ from: "/search" });

  return <SearchContent key={query ?? ""} query={query} />;
}

function SearchContent({ query }: { query?: string }) {
  const navigate = useNavigate({ from: "/search" });
  const [searchText, setSearchText] = useState(query ?? "");

  const normalizedQuery = query?.trim() ?? "";

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextQuery = searchText.trim();
    navigate({ search: nextQuery ? { query: nextQuery } : {} });
  }

  return (
    <main className="min-h-[calc(100vh-91px)] bg-[#f7f8fa]">
      <section
        className="flex min-h-105 items-start justify-center px-5 pb-24 pt-28 sm:px-10 lg:h-145.5 lg:min-h-0 lg:px-18 lg:pb-52.5 lg:pt-52.25"
        aria-labelledby="search-title"
      >
        <div className="w-full max-w-200 text-center">
          <h1
            className="mb-10 text-[32px] leading-tight font-bold tracking-[-1.5px] text-[#1d1e20] sm:text-[40px] lg:text-[44px]"
            id="search-title"
          >
            어떤 영화를 찾고 있나요?
          </h1>
          <form
            className="flex h-17 w-full items-center rounded-xl border-2 border-[#1d1e20] bg-white px-3 shadow-[0_18px_34px_rgba(29,30,32,0.10)] sm:px-4"
            onSubmit={handleSubmit}
          >
            <img
              className="ml-1 size-5 shrink-0 opacity-70 sm:ml-2"
              src="/icons/movie-icons/search.svg"
              alt=""
            />
            <input
              className="min-w-0 flex-1 bg-transparent px-3 text-base text-[#1d1e20] outline-none sm:px-4"
              aria-label="검색어"
              placeholder="예: 스파이더맨"
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
            />
            <button
              className="h-11 shrink-0 rounded-[9px] bg-[#1d1e20] px-5 text-sm font-semibold text-white hover:bg-[#34363a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2864dc]"
              type="submit"
            >
              검색
            </button>
          </form>
        </div>
      </section>

      {normalizedQuery ? <SearchResults key={normalizedQuery} query={normalizedQuery} /> : (
        <RequestMessage>검색어를 입력해 영화를 찾아보세요.</RequestMessage>
      )}
    </main>
  );
}

function SearchResults({ query }: { query: string }) {
  const request = useCallback((signal: AbortSignal) => searchMovies({ query, signal }), [query]);
  const state = useMovieRequest(request);

  return (
    <section className="mx-auto max-w-7xl px-5 pb-16 sm:px-10 lg:px-20" aria-live="polite">
      <h2 className="mb-2 text-xl font-semibold">‘{query}’ 검색 결과</h2>
      {state.status === "loading" && <RequestMessage>검색 결과를 불러오는 중이에요.</RequestMessage>}
      {state.status === "error" && <RequestMessage error>검색 결과를 불러오지 못했어요.</RequestMessage>}
      {state.status === "success" && (
        <>
          <p className="mb-6 text-sm text-[#676d76]">영화 {state.data.total_results}편</p>
          {state.data.results.length === 0 ? <RequestMessage>검색 결과가 없어요.</RequestMessage> : (
            <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {state.data.results.map((movie) => (
                <li key={movie.id} className="min-w-0 rounded-lg bg-white p-3">
                  <MovieCard movie={movie} posterClassName="aspect-2/3" />
                  <p className="mt-1 text-sm text-[#676d76]">{movie.original_title}</p>
                  <p className="mt-2 line-clamp-2 text-sm text-[#676d76]">{movie.overview || "줄거리 정보가 없어요."}</p>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </section>
  );
}
