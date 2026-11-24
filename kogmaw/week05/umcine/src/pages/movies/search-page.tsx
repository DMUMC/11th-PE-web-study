import { type FormEvent, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { MovieGrid } from '../../components/movies/movie-grid';
import { Pagination } from '../../components/movies/pagination';
import { MovieGridSkeleton, RequestMessage } from '../../components/movies/request-message';
import type { MoviePage } from '../../types/movie';

interface SearchPageProps {
  query?: string;
  data?: MoviePage | null;
  loading?: boolean;
}

function SearchForm({ initialQuery }: { initialQuery: string }) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState(initialQuery);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = searchTerm.trim();
    void navigate({ to: '/search', search: query ? { query } : {} });
  };

  return (
    <form
      className="flex h-12 w-full overflow-hidden rounded-md border border-[#2c3036] bg-white shadow-[0_6px_14px_rgba(15,23,42,0.12)] focus-within:ring-2 focus-within:ring-[#2463cf]/30"
      role="search"
      onSubmit={handleSubmit}
    >
      <label className="sr-only" htmlFor="movie-search">영화 검색어</label>
      <div className="grid w-11 shrink-0 place-items-center"><img className="size-4 opacity-60" src="/icons/search.svg" alt="" /></div>
      <input
        className="min-w-0 flex-1 bg-transparent text-sm text-[#17191c] outline-none placeholder:text-[#a2a7ae]"
        id="movie-search" name="query" type="search" value={searchTerm}
        placeholder="영화 제목으로 검색해보세요" maxLength={200}
        onChange={(event) => setSearchTerm(event.target.value)}
      />
      <button className="m-1.5 min-w-[54px] rounded bg-[#1c2027] px-3 text-xs font-bold text-white transition hover:bg-black" type="submit">검색</button>
    </form>
  );
}

export function SearchPage({ query, data, loading = false }: SearchPageProps) {
  const navigate = useNavigate();
  const keyword = query?.trim() ?? '';

  return (
    <main className="w-full flex-1 pb-12">
      <section className="mx-auto flex w-full max-w-2xl flex-col items-center px-4 pt-20 pb-14 sm:px-6 sm:pt-[150px] sm:pb-24">
        <h1 className="mb-8 text-center text-[28px] font-bold tracking-[-1px] text-[#191b1e] sm:text-[30px]">어떤 영화를 찾고 있나요?</h1>
        <SearchForm key={keyword} initialQuery={keyword} />
        {!keyword && <p className="mt-5 text-sm text-[#7d838c]">검색어를 입력해 주세요.</p>}
      </section>

      {keyword && (
        <section className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8" aria-label="영화 검색 결과">
          <div className="mb-6">
            <h2 className="break-words text-xl font-bold tracking-[-0.5px] text-[#17191c]">&lsquo;{keyword}&rsquo; 검색 결과</h2>
            {data && <p className="mt-2 text-xs text-[#737b87]" role="status">전체 {data.total_results.toLocaleString('ko-KR')}개</p>}
          </div>
          {loading ? <MovieGridSkeleton search /> : data && data.results.length > 0 ? (
            <>
              <MovieGrid movies={data.results} variant="search" />
              <Pagination
                currentPage={data.page}
                totalPages={data.total_pages}
                onPageChange={(page) => { void navigate({ to: '/search', search: { query: keyword, ...(page > 1 ? { page } : {}) } }); }}
              />
            </>
          ) : (
            <RequestMessage title={`‘${keyword}’에 대한 검색 결과가 없어요.`} description="다른 영화 제목으로 검색해 보세요." />
          )}
        </section>
      )}
    </main>
  );
}
