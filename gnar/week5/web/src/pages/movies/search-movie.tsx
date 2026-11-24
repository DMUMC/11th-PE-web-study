import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { searchMovies } from "../../api/movies/search-movies";
import type { TmdbMovieListItem } from "../../api/movies/models";
import MovieGrid from "../../components/movie-grid";

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = (searchParams.get("query") ?? "").trim();

  const [movies, setMovies] = useState<TmdbMovieListItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(
    null,
  );

  useEffect(() => {
    let ignore = false;

    setMovies([]);
    setErrorMessage(null);

    // 공백만 입력했거나 검색어가 없으면 요청하지 않습니다.
    if (!query) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    searchMovies({ query })
      .then((response) => {
        if (!ignore) {
          setMovies(response.results);
        }
      })
      .catch(() => {
        if (!ignore) {
          setErrorMessage("검색 결과를 불러오지 못했어요.");
        }
      })
      .finally(() => {
        if (!ignore) {
          setIsLoading(false);
        }
      });

    return () => {
      // 이전 검색 결과가 늦게 도착해도 새 검색 결과를 덮지 못합니다.
      ignore = true;
    };
  }, [query]);

  return (
    <section>
      <h1>영화 검색</h1>

      {!query ? (
        <p className="status">검색할 영화 제목을 입력해주세요.</p>
      ) : isLoading ? (
        <p className="status" role="status">
          검색 결과를 불러오는 중이에요.
        </p>
      ) : errorMessage ? (
        <p className="status error" role="alert">
          {errorMessage}
        </p>
      ) : movies.length === 0 ? (
        <p className="status">
          “{query}”에 해당하는 영화가 없어요.
        </p>
      ) : (
        <>
          <p className="search-description">
            “{query}” 검색 결과
          </p>
          <MovieGrid movies={movies} />
        </>
      )}
    </section>
  );
}