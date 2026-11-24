import { useEffect, useState } from "react";
import { getMovies } from "../../api/movies/get-movies";
import type { TmdbMovieListItem } from "../../api/movies/models";
import MovieGrid from "../../components/movie-grid";

export default function MovieListPage() {
  const [movies, setMovies] = useState<TmdbMovieListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(
    null,
  );

  useEffect(() => {
    let ignore = false;

    async function loadMovies() {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const response = await getMovies({ page: 1 });

        if (!ignore) {
          setMovies(response.results);
        }
      } catch {
        if (!ignore) {
          setErrorMessage("영화 목록을 불러오지 못했어요.");
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    void loadMovies();

    return () => {
      // 화면을 떠난 뒤 도착한 응답이 상태를 바꾸지 않게 합니다.
      ignore = true;
    };
  }, []);

  return (
    <section>
      <h1>인기 영화</h1>

      {isLoading ? (
        <p className="status" role="status">
          영화 목록을 불러오는 중이에요.
        </p>
      ) : errorMessage ? (
        <p className="status error" role="alert">
          {errorMessage}
        </p>
      ) : movies.length === 0 ? (
        <p className="status">조건에 맞는 영화가 없어요.</p>
      ) : (
        <MovieGrid movies={movies} />
      )}
    </section>
  );
}