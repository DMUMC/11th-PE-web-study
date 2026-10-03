import { useState } from "react";
import MovieCard from "./movie-card";
import type { Movie } from "./types/movie";
import { movies } from "./data/movies";

interface MovieGridProps {
    movies: Movie[];
}

export default function MovieGrid({ movies: initialMovies }: MovieGridProps) {
    const [movies, setMovies] = useState(initialMovies);

    const bookMark = (movieId: number) => {
        setMovies((currentMovies) =>
            currentMovies.map((movie) =>
                movie.id === movieId
                    ? {
                        ...movie,
                        isBookmarked: !movie.isBookmarked,
                    }
                    : movie
            )
        );
    };
    return (
        <div className="grid grid-cols-5 gap-[20px]">
            {movies.map((movie: Movie) => (
                <MovieCard
                    id={movie.id}
                    title={movie.title}
                    posterPath={movie.posterPath}
                    releaseDate={movie.releaseDate}
                    isBookmarked={movie.isBookmarked}
                    onBookmark={bookMark} />
            ))}
        </div>
    )
}