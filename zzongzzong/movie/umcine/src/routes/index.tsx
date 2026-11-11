import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getMovies } from "../api/movies/get-movies";
import MovieGrid from "../components/movies/movie-grid";
import type { Movie } from "../types/movie";
import { toMovie } from "../utils/movies/to-movie";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let ignore = false;

    async function loadMovies() {
      setIsLoading(true);
      setError("");

      try {
        const response = await getMovies({ page: 1 });

        if (!ignore) {
          setMovies(response.results.map(toMovie));
        }
      } catch {
        if (!ignore) {
          setError("영화 목록을 불러오지 못했어요.");
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    void loadMovies();

    return () => {
      ignore = true;
    };
  }, [retryCount]);

  return (
    <div className="px-[84px] py-[24px]">
      <h1 className="text-2xl font-bold mb-6">인기 영화</h1>

      {isLoading ? (
        <p role="status">영화를 불러오는 중이에요.</p>
      ) : error ? (
        <div role="alert">
          <p>{error}</p>
          <button onClick={() => setRetryCount((count) => count + 1)}>
            다시 시도
          </button>
        </div>
      ) : movies.length === 0 ? (
        <p>표시할 영화가 없어요.</p>
      ) : (
        <MovieGrid movies={movies} />
      )}
    </div>
  );
}