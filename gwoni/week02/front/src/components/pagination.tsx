import { useState } from "react";
import type { Movie } from "../types/movie";
import MovieGrid from "./movie-grid";

const ITEMS_PER_PAGE = 10;

export default function Pagination({ movies }: { movies: Movie[] }) {
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(movies.length / ITEMS_PER_PAGE);
  const visibleMovies = movies.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );
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
