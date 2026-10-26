import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState, type SubmitEvent } from "react";
import { movieApi } from "../../api";
import { useBookmarkStore } from "../../stores/bookmark-store";
import type { MoviePage } from "../../types/movie";

export function SearchPage() {
  const { query } = useSearch({ from: "/search" });
  const navigate = useNavigate({ from: "/search" });
  const [searchText, setSearchText] = useState(query ?? "");
  const [moviePage, setMoviePage] = useState<MoviePage | null>(null);
  const bookmarkedIds = useBookmarkStore((state) => state.bookmarkedIds);
  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);

  useEffect(() => {
    setSearchText(query ?? "");
  }, [query]);

  const normalizedQuery = query?.trim() ?? "";

  useEffect(() => {
    // 빈 검색어는 요청하지 않아요.
    if (!normalizedQuery) return;

    let ignore = false;

    movieApi
      .searchMovies(normalizedQuery)
      .then((result) => {
        if (!ignore) setMoviePage(result);
      })
      .catch((error) => console.error(error));

    // 검색어가 바뀌면 이전 응답이 현재 결과를 덮어쓰지 않게 해요.
    return () => {
      ignore = true;
    };
  }, [normalizedQuery]);

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextQuery = searchText.trim();
    navigate({
      search: nextQuery ? { query: nextQuery } : {},
    });
  }

  return (
    <main>
      <h1>영화 검색</h1>
      <form onSubmit={handleSubmit}>
        <input
          aria-label="검색어"
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
        />
        <button type="submit">검색</button>
      </form>

      {!normalizedQuery ? (
        <p>검색어를 입력해 주세요.</p>
      ) : !moviePage ? null : (
        <>
          <h2>‘{query}’ 검색 결과</h2>
          <p>영화 {moviePage.totalResults}편</p>
          {moviePage.movies.length === 0 ? (
            <p>검색 결과가 없어요.</p>
          ) : (
            <ul>
              {moviePage.movies.map((movie) => (
                <li key={movie.id}>
                  <img src={movie.posterPath} alt={`${movie.title} 포스터`} />
                  <h3>{movie.title}</h3>
                  <p>{movie.originalTitle}</p>
                  <p>{movie.releaseDate}</p>
                  <p>{movie.overview}</p>
                  <button type="button" onClick={() => toggleBookmark(movie.id)}>
                    <img
                      src={
                        bookmarkedIds.includes(movie.id)
                          ? "/icons/bookmark.svg"
                          : "/icons/bookmark-outline.svg"
                      }
                      alt={bookmarkedIds.includes(movie.id) ? "찜 해제" : "찜하기"}
                      width={24}
                      height={24}
                    />
                  </button>
                  <Link
                    to="/movies/$movieId"
                    params={{ movieId: String(movie.id) }}
                  >
                    상세 보기
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </main>
  );
}
