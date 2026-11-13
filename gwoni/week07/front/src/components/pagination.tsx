import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { movieApi } from "../api";
import MovieGrid from "./movie-grid";

const MAX_PAGE = 10; // 보여 줄 최대 페이지 수 (TMDB는 500까지 허용)

export default function Pagination() {
  const [page, setPage] = useState(1);

  const moviesQuery = useQuery({
    queryKey: ["movies", "list", { page }],
    queryFn: () => movieApi.getPopularMovies(page),
  });

  if (moviesQuery.isPending) return <p>영화를 불러오는 중이에요.</p>;
  if (moviesQuery.isError) return <p>{moviesQuery.error.message}</p>;

  const moviePage = moviesQuery.data;
  const visibleMovies = moviePage.movies;
  const totalPages = Math.min(moviePage.totalPages, MAX_PAGE);
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="pagination">
      <MovieGrid movies={visibleMovies} />

      <div>
        <button type="button" disabled={page === 1} onClick={() => setPage(page - 1)}>
          <img src="/icons/chevron-left.svg" alt="이전" width={20} height={20} />
        </button>

        {pages.map((n) => (
          <button key={n} type="button" disabled={n === page} onClick={() => setPage(n)}>
            {n}
          </button>
        ))}

        <button
          type="button"
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
        >
          <img src="/icons/chevron-right.svg" alt="다음" width={20} height={20} />
        </button>
      </div>
    </div>
  );
}
