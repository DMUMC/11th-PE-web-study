import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState, type SubmitEvent } from "react";
import { Icon } from "../../components/common/icon";
import { BookmarkButton } from "../../components/movies/bookmark-button";
import type { TmdbMovieListItem } from "../../api/movies/models";
import { searchMovies } from "../../api/movies/search-movies";
import { StatusMessage } from "../../components/common/status-message";
import { MoviePoster } from "../../components/movies/movie-poster";
import { formatReleaseDate } from "../../utils/movies/format-movie";
import { getTmdbPosterUrl } from "../../utils/movies/tmdb-image";
import { cn } from "../../utils/cn";

interface SearchFormProps {
  initialText: string;
  hasQuery: boolean;
}

// query가 바뀌면 key로 다시 만들어져 입력창이 URL과 같은 값으로 시작한다.
function SearchForm({ initialText, hasQuery }: SearchFormProps) {
  const navigate = useNavigate({ from: "/search" });
  const [searchText, setSearchText] = useState(initialText);

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextQuery = searchText.trim();
    navigate({ search: nextQuery ? { query: nextQuery } : {} });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "flex items-center bg-white",
        hasQuery
          ? "mt-4 h-[52px] gap-3 rounded-lg border border-line pl-4 pr-1.5"
          : "mx-auto mt-8 h-[72px] w-full max-w-[788px] gap-4 rounded-xl border-2 border-ink pl-6 pr-3.5 shadow-lg",
      )}
    >
      <Icon name="search" className="text-ink-sub" />
      <input
        aria-label="검색어"
        placeholder="예: 스파이더맨"
        value={searchText}
        onChange={(event) => setSearchText(event.target.value)}
        className={cn(
          "h-full min-w-0 flex-1 bg-transparent outline-none placeholder:text-ink-muted",
          hasQuery ? "text-sm" : "text-lg",
        )}
      />
      {hasQuery && (
        <Link
          to="/search"
          aria-label="검색어 지우기"
          className="flex size-9 items-center justify-center text-ink"
        >
          <Icon name="close" />
        </Link>
      )}
      <button
        type="submit"
        className={cn(
          "shrink-0 rounded-md bg-ink px-4 text-sm font-bold text-white",
          hasQuery ? "h-10" : "h-11",
        )}
      >
        {hasQuery ? "다시 검색" : "검색"}
      </button>
    </form>
  );
}

interface SearchResultsProps {
  query: string;
}

// 검색어마다 key로 새로 만들어져 결과, 로딩, 오류 상태가 처음 값에서 시작한다.
function SearchResults({ query }: SearchResultsProps) {
  const [movies, setMovies] = useState<TmdbMovieListItem[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    searchMovies({ query })
      .then((response) => {
        if (ignore) return;
        setMovies(response.results);
        setTotalResults(response.total_results);
      })
      .catch(() => {
        if (!ignore) setErrorMessage("검색 결과를 불러오지 못했어요.");
      })
      .finally(() => {
        if (!ignore) setIsLoading(false);
      });

    // 검색어가 바뀌면 늦게 도착한 이전 응답이 현재 결과를 덮어쓰지 않게 한다.
    return () => {
      ignore = true;
    };
  }, [query]);

  function renderResults() {
    if (isLoading) {
      return <StatusMessage>검색 결과를 불러오는 중이에요.</StatusMessage>;
    }
    if (errorMessage) {
      return <StatusMessage tone="error">{errorMessage}</StatusMessage>;
    }
    if (movies.length === 0) {
      return <StatusMessage>조건에 맞는 영화가 없어요.</StatusMessage>;
    }

    return (
      <ul className="grid grid-cols-1 gap-x-10 lg:grid-cols-2">
        {movies.map((movie) => (
          <li key={movie.id} className="flex gap-[18px] border-b border-line py-5">
            <div className="relative h-[190px] w-[126px] shrink-0 overflow-hidden rounded-lg">
              <MoviePoster
                className="size-full"
                src={getTmdbPosterUrl(movie.poster_path)}
                alt={`${movie.title} 포스터`}
              />
              <BookmarkButton
                movieId={movie.id}
                title={movie.title}
                className="absolute right-2 top-2"
              />
            </div>
            <div className="min-w-0 pt-1">
              <h3 className="text-lg font-bold leading-7">{movie.title}</h3>
              <p className="mt-1 flex flex-wrap gap-x-2.5 text-xs text-ink-muted">
                <span>{movie.original_title}</span>
                <span>{formatReleaseDate(movie.release_date)}</span>
              </p>
              <p className="mt-2.5 line-clamp-3 text-[13px] leading-5 text-ink-sub">
                {movie.overview || "줄거리 정보가 없어요."}
              </p>
              <Link
                to="/movies/$movieId"
                params={{ movieId: String(movie.id) }}
                className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-primary"
              >
                상세 보기
                <Icon name="arrow-right" className="size-4" />
              </Link>
            </div>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <>
      <div className="mt-5 flex items-center justify-between border-b border-line pb-4">
        <h2 className="text-base font-bold">‘{query}’ 검색 결과</h2>
        {!isLoading && !errorMessage && (
          <p className="text-xs text-ink-muted">영화 {totalResults}편</p>
        )}
      </div>
      {renderResults()}
    </>
  );
}

export function SearchPage() {
  const { query = "" } = useSearch({ from: "/search" });
  const normalizedQuery = query.trim();

  // 빈 검색어는 요청하지 않고 검색 안내만 보여 준다.
  if (!normalizedQuery) {
    return (
      <main className="mx-auto w-full max-w-[1440px] flex-1 px-5 pb-20 pt-24 text-center lg:px-20 lg:pt-[212px]">
        <h1 className="text-3xl font-extrabold tracking-[-0.8px] lg:text-[40px] lg:leading-[52px]">
          어떤 영화를 찾고 있나요?
        </h1>
        <SearchForm key="empty" initialText="" hasQuery={false} />
        <p className="mt-4 text-sm text-ink-muted">검색어를 입력해 주세요.</p>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-[1440px] flex-1 px-5 pb-[54px] pt-6 lg:px-20">
      <h1 className="text-4xl font-bold leading-[44px] tracking-[-0.72px]">
        영화 검색
      </h1>
      <SearchForm key={`form-${query}`} initialText={query} hasQuery />
      <SearchResults key={`results-${normalizedQuery}`} query={normalizedQuery} />
    </main>
  );
}
