"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { useQuery } from "@tanstack/react-query";
import { movieQueries } from "../../api/movies/queries";
import MovieGrid from "../../components/movies/movie-grid";
import Pagination from "../../components/movies/pagination";
import { QueryError, QueryFeedback } from "../../components/movies/query-feedback";
import { toMovie } from "../../utils/movies/to-movie";

export function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const normalizedQuery = searchParams.get("query")?.trim() ?? "";
  const requestedPage = Number(searchParams.get("page"));
  const page = Number.isInteger(requestedPage) && requestedPage > 0 && requestedPage <= 500 ? requestedPage : 1;
  const searchQuery = useQuery(movieQueries.search(normalizedQuery, page));
  const data = searchQuery.data;

  function navigateToSearch(query: string, nextPage: number) {
    const params = new URLSearchParams();
    if (query) params.set("query", query);
    params.set("page", String(nextPage));
    router.push(`/search?${params.toString()}`);
  }

  return (
    <div className="px-[84px] py-[24px]">
      <h1 className="text-2xl font-bold mb-6">영화 검색</h1>
      <SearchForm key={normalizedQuery} initialQuery={normalizedQuery} onSearch={(query) => navigateToSearch(query.trim(), 1)} />
      {!normalizedQuery ? (
        <p>찾고 싶은 영화 제목을 입력해 주세요.</p>
      ) : searchQuery.isPending ? (
        <p role="status">{searchQuery.isPaused ? "연결을 기다리고 있어요." : "검색 결과를 불러오는 중이에요."}</p>
      ) : searchQuery.isError && !data ? (
        <QueryError message="검색 결과를 불러오지 못했어요." onRetry={() => void searchQuery.refetch()} />
      ) : data ? (
        <>
          <QueryFeedback isFetching={searchQuery.isFetching} isError={searchQuery.isError} onRetry={() => void searchQuery.refetch()} />
          <p className="mb-4">“{normalizedQuery}” 검색 결과 {data.total_results}개</p>
          {data.results.length === 0 ? (
            <p>검색 결과가 없어요. 다른 영화 제목으로 검색해 보세요.</p>
          ) : <MovieGrid movies={data.results.map(toMovie)} />}
          <Pagination page={page} totalPages={data.total_pages}
            onPageChange={(nextPage) => navigateToSearch(normalizedQuery, nextPage)} />
        </>
      ) : null}
    </div>
  );
}

function SearchForm({ initialQuery, onSearch }: { initialQuery: string; onSearch: (query: string) => void }) {
  const [value, setValue] = useState(initialQuery);
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSearch(value);
  }
  return (
    <form onSubmit={handleSubmit} role="search" className="flex gap-3 mb-6">
      <label htmlFor="movie-search" className="sr-only">영화 제목</label>
      <input id="movie-search" type="search" value={value} onChange={(event) => setValue(event.target.value)}
        placeholder="영화 제목을 입력해 주세요" className="flex-1 px-4 py-3 rounded-lg border border-[#E3E6EB] bg-white" />
      <button type="submit" className="px-6 rounded-lg bg-[#17191E] text-white cursor-pointer">검색</button>
    </form>
  );
}