import { Link, useParams } from "@tanstack/react-router";
import { movies } from "../../data/movies";
import { useBookmarkStore } from "../../stores/bookmark-store";

export function MovieDetailPage() {
  const { movieId } = useParams({ from: "/movies/$movieId" });
  const movie = movies.find((item) => item.id === Number(movieId));
  const isBookmarked = useBookmarkStore((state) =>
    state.bookmarkedIds.includes(Number(movieId)),
  );
  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);

  if (!movie) {
    return <main>영화를 찾을 수 없어요.</main>;
  }

  return (
    <main>
      <img src={movie.backdropPath} alt="" aria-hidden="true" />
      <Link to="/">영화 목록</Link>
      <img src={movie.posterPath} alt={`${movie.title} 포스터`} />
      <h1>{movie.title}</h1>
      <button type="button" onClick={() => toggleBookmark(movie.id)}>
        <img
          src={isBookmarked ? "/icons/bookmark.svg" : "/icons/bookmark-outline.svg"}
          alt={isBookmarked ? "찜 해제" : "찜하기"}
          width={24}
          height={24}
        />
      </button>
      <p>{movie.originalTitle}</p>
      <p>{movie.releaseDate}</p>
      <p>{movie.genres.join(" · ")}</p>
      <p>{movie.runtime}</p>
      <h2>{movie.tagline}</h2>
      <p>{movie.overview}</p>
    </main>
  );
}
