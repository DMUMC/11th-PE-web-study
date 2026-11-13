import { useEffect, useState } from "react";
import { movieApi } from "../api";
import type { MoviePage } from "../types/movie";
import MovieGrid from "./movie-grid";

const MAX_PAGE = 10; // 보여 줄 최대 페이지 수 (TMDB는 500까지 허용)

export default function Pagination() {
  const [page, setPage] = useState(1);
  const [moviePage, setMoviePage] = useState<MoviePage | null>(null);

  useEffect(() => {
    let ignore = false;

    movieApi
      .getPopularMovies(page)
      .then((result) => {
        if (!ignore) setMoviePage(result);
      })
      .catch((error) => console.error(error));

    // 페이지를 빠르게 넘길 때 이전 응답이 현재 목록을 덮어쓰지 않게 해요.
    return () => {
      ignore = true;
    };
  }, [page]);

  // 첫 응답이 오기 전에는 아무것도 그리지 않아요.
  if (!moviePage) return null;

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
