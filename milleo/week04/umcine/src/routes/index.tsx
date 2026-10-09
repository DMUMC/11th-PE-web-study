import { createFileRoute } from '@tanstack/react-router';
import MovieGrid from '../components/movie-grid';
import Pagination from '../components/pagination';
import { useMovies } from '../context/movies';
export const Route = createFileRoute('/')({ component: MovieList });
function MovieList() {
  const { movieList, toggleBookmark } = useMovies();
  return <main className="mx-auto w-full max-w-[1440px] flex-1 px-5 pt-6 pb-10 md:px-20"><h1 className="mb-5 text-[34px] leading-[1.4] font-bold tracking-tight">영화 목록</h1><MovieGrid movies={movieList} onToggleBookmark={toggleBookmark} /><Pagination /></main>;
}
