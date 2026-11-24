import { type FormEvent, useMemo, useState } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { BookmarkButton } from '../../components/movies/bookmark-button';
import { movies } from '../../data/movies';

interface SearchPageProps {
  query?: string;
}

interface SearchFormProps {
  initialQuery: string;
}

function SearchForm({ initialQuery }: SearchFormProps) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState(initialQuery);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = searchTerm.trim();

    void navigate({
      to: '/search',
      search: query ? { query } : {},
    });
  };

  return (
    <form
      className="flex h-12 w-full overflow-hidden rounded-md border border-[#2c3036] bg-white shadow-[0_6px_14px_rgba(15,23,42,0.12)]"
      role="search"
      onSubmit={handleSubmit}
    >
      <label className="sr-only" htmlFor="movie-search">
        영화 검색어
      </label>
      <div className="grid w-11 shrink-0 place-items-center">
        <img className="size-4 opacity-60" src="/icons/search.svg" alt="" />
      </div>
      <input
        className="min-w-0 flex-1 bg-transparent text-sm text-[#17191c] outline-none placeholder:text-[#a2a7ae]"
        id="movie-search"
        name="query"
        type="search"
        value={searchTerm}
        placeholder="영화, 감독으로 검색해보세요"
        onChange={(event) => setSearchTerm(event.target.value)}
      />
      <button
        className="m-1.5 min-w-[54px] rounded bg-[#1c2027] px-3 text-xs font-bold text-white transition hover:bg-black"
        type="submit"
      >
        검색
      </button>
    </form>
  );
}

export function SearchPage({ query }: SearchPageProps) {
  const normalizedQuery = query?.trim() ?? '';
  const results = useMemo(() => {
    if (!normalizedQuery) return [];

    const keyword = normalizedQuery.toLocaleLowerCase();
    return movies.filter(
      (movie) =>
        movie.title.toLocaleLowerCase().includes(keyword) ||
        movie.originalTitle.toLocaleLowerCase().includes(keyword),
    );
  }, [normalizedQuery]);

  if (!normalizedQuery) {
    return (
      <main className="min-h-[calc(100vh-73px)] bg-[#f5f7f9]">
        <section className="mx-auto flex w-full max-w-2xl flex-col items-center px-4 pt-[150px] sm:px-6">
          <h1 className="mb-8 text-center text-[30px] font-bold tracking-[-1px] text-[#191b1e]">
            어떤 영화를 찾고 있나요?
          </h1>
          <SearchForm key="empty-search" initialQuery="" />
          <p className="mt-5 text-sm text-[#7d838c]">검색어를 입력해 주세요.</p>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-73px)] bg-[#f5f7f9]">
      <section className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto mb-10 max-w-2xl">
          <SearchForm key={normalizedQuery} initialQuery={normalizedQuery} />
        </div>

        <div className="mb-7 flex flex-wrap items-end justify-between gap-2 border-b border-[#dfe3e8] pb-4">
          <h1 className="text-[26px] font-bold tracking-[-0.8px] text-[#17191c]">
            &lsquo;{normalizedQuery}&rsquo; 검색 결과
          </h1>
          <p className="text-sm font-medium text-[#5d6470]">총 {results.length}개</p>
        </div>

        {results.length === 0 ? (
          <div className="rounded-lg border border-dashed border-[#cbd1d8] bg-white px-6 py-20 text-center">
            <p className="text-lg font-semibold text-[#343940]">
              &lsquo;{normalizedQuery}&rsquo;에 대한 검색 결과가 없어요.
            </p>
            <p className="mt-2 text-sm text-[#7d838c]">다른 검색어를 입력해 보세요.</p>
          </div>
        ) : (
          <ul className="space-y-5">
            {results.map((movie) => (
              <li className="relative" key={movie.id}>
                <Link
                  className="grid grid-cols-[105px_minmax(0,1fr)] gap-5 rounded-lg bg-white p-4 pr-14 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2463cf] sm:grid-cols-[140px_minmax(0,1fr)] sm:gap-7 sm:p-5 sm:pr-16"
                  to="/movies/$movieId"
                  params={{ movieId: String(movie.id) }}
                >
                  <img
                    className="aspect-[2/3] w-full rounded-md object-cover"
                    src={movie.posterPath}
                    alt={`${movie.title} 포스터`}
                  />
                  <div className="min-w-0 self-center">
                    <h2 className="text-xl font-bold tracking-[-0.5px] text-[#17191c] sm:text-2xl">
                      {movie.title}
                    </h2>
                    <p className="mt-1 text-sm text-[#7d838c]">{movie.originalTitle}</p>
                    <time
                      className="mt-3 block text-xs font-medium text-[#5d6470]"
                      dateTime={movie.releaseDate.replaceAll('.', '-')}
                    >
                      개봉일 {movie.releaseDate}
                    </time>
                    <p className="mt-4 line-clamp-3 text-sm leading-6 text-[#525964]">
                      {movie.overview}
                    </p>
                  </div>
                </Link>
                <BookmarkButton
                  className="absolute right-4 top-4 sm:right-5 sm:top-5"
                  movieId={movie.id}
                  movieTitle={movie.title}
                />
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
