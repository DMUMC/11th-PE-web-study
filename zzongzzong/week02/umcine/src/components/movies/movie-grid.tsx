import MovieCard from "./movie-card";
import type { Movie } from "../../types/movie";

interface MovieGridProps {
    movies: Movie[];
}

export default function MovieGrid({
    movies,
}: MovieGridProps) {
    return (
        <div className="grid grid-cols-5 gap-[20px]">
            {movies.map((movie: Movie) => (
                <MovieCard
                    key={movie.id}
                    {...movie}
                />
            ))}
        </div>
    );
}