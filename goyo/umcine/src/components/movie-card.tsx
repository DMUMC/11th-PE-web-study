
import type { Movie } from "../types/movie";

interface MovieCardProps {
  movie: Movie;
  isBookmarked: boolean;
  onToggleBookmark: (id: number) => void;
}

export default function MovieCard({
  movie,
  isBookmarked,
  onToggleBookmark,
}: MovieCardProps) {
  return (
    <article
      className="movie-card"
      style={{
        width: "100%",
        minWidth: 0,
        fontFamily: "Pretendard, sans-serif",
      }}
    >
      <div
        className="movie-poster"
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "2 / 3",
          borderRadius: "8px",
          overflow: "hidden",
        }}
      >
        <img
          src={movie.posterPath}
          alt={`${movie.title} 포스터`}
          style={{
            display: "block",
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />

        <button
          type="button"
          aria-label={isBookmarked ? "북마크 해제" : "북마크 추가"}
          aria-pressed={isBookmarked}
          onClick={() => onToggleBookmark(movie.id)}
          style={{
            position: "absolute",
            top: "8px",
            right: "6px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "34px",
            height: "34px",
            padding: "7.5px 6px",
            backgroundColor: isBookmarked
              ? "#2563EB"
              : "#17191E",
            border: isBookmarked
              ? "1px solid #2563EB"
              : "1px solid #FFFFFF",
            borderRadius: "8px",
            boxSizing: "border-box",
            cursor: "pointer",
          }}
        >
          <img
            src={
              isBookmarked
                ? "/movie-icons/bookmark.svg"
                : "/movie-icons/bookmark-outline.svg"
            }
            alt=""
            style={{
              width: "20px",
              height: "20px",
              display: "block",
            }}
          />
        </button>
      </div>

      <div
        className="movie-info"
        style={{
          paddingTop: "8px",
        }}
      >
        <h3
          className="movie-title"
          style={{
            margin: 0,
            fontSize: "14px",
            fontWeight: 700,
            lineHeight: "140%",
            color: "#17191E",
          }}
        >
          {movie.title}
        </h3>

        <p
          className="movie-release-date"
          style={{
            margin: "4px 0 0",
            fontSize: "12px",
            fontWeight: 400,
            color: "#969DA8",
          }}
        >
          {movie.releaseDate}
        </p>
      </div>
    </article>
  );
}
