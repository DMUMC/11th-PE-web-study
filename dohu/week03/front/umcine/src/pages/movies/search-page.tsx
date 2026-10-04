import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useState, type SubmitEvent } from "react";
import { Icon } from "../../components/common/icon";
import { movies } from "../../data/movies";
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

export function SearchPage() {
  const { query } = useSearch({ from: "/search" });

  const normalizedQuery = query?.trim().toLowerCase() ?? "";
  const searchResults = normalizedQuery
    ? movies.filter(
        (movie) =>
          movie.title.toLowerCase().includes(normalizedQuery) ||
          movie.originalTitle.toLowerCase().includes(normalizedQuery),
      )
    : [];

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
      <SearchForm key={query} initialText={query ?? ""} hasQuery />

      <div className="mt-5 flex items-center justify-between border-b border-line pb-4">
        <h2 className="text-base font-bold">‘{query}’ 검색 결과</h2>
        <p className="text-xs text-ink-muted">영화 {searchResults.length}편</p>
      </div>

      {searchResults.length === 0 ? (
        <p className="py-20 text-center text-sm text-ink-sub">
          검색 결과가 없어요.
        </p>
      ) : (
        <ul className="grid grid-cols-1 gap-x-10 lg:grid-cols-2">
          {searchResults.map((movie) => (
            <li
              key={movie.id}
              className="flex gap-[18px] border-b border-line py-5"
            >
              <img
                className="h-[190px] w-[126px] shrink-0 rounded-lg object-cover"
                src={movie.posterPath}
                alt={`${movie.title} 포스터`}
              />
              <div className="min-w-0 pt-1">
                <h3 className="text-lg font-bold leading-7">{movie.title}</h3>
                <p className="mt-1 flex gap-2.5 text-xs text-ink-muted">
                  <span>{movie.originalTitle}</span>
                  <span>{movie.releaseDate}</span>
                </p>
                <p className="mt-2.5 text-[13px] leading-5 text-ink-sub">
                  {movie.overview}
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
      )}
    </main>
  );
}
