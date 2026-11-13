import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "@tanstack/react-router";
import { movieApi } from "../../api";
import { useBookmarkStore } from "../../stores/bookmark-store";

export function MovieDetailPage() {
  const { movieId } = useParams({ from: "/movies/$movieId" });
  const isBookmarked = useBookmarkStore((state) =>
    state.bookmarkedIds.includes(Number(movieId)),
  );
  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);

  const movieQuery = useQuery({
    queryKey: ["movies", "detail", Number(movieId)],
    queryFn: () => movieApi.getMovieDetail(Number(movieId)),
  });

  if (movieQuery.isPending) return <main>영화를 불러오는 중이에요.</main>;
  if (movieQuery.isError) return <main>{movieQuery.error.message}</main>;

  const movie = movieQuery.data;
  if (movie === null) return <main>영화를 찾을 수 없어요.</main>;

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
      <p>{movie.runtime ?? "상영 시간 정보가 없어요."}</p>
      <h2>{movie.tagline}</h2>
      <p>{movie.overview}</p>
    </main>
  );
}
