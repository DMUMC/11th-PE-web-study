import type { Movie } from '../types/movie';
import MovieCard from './movie-card';
export default function MovieGrid({ movies, onToggleBookmark }: { movies: Movie[]; onToggleBookmark: (id: number) => void }) {
  return <div className="grid grid-cols-2 gap-x-[18px] gap-y-5 sm:grid-cols-3 lg:grid-cols-5">{movies.map(movie => <MovieCard key={movie.id} movie={movie} onToggleBookmark={onToggleBookmark} />)}</div>;
}
