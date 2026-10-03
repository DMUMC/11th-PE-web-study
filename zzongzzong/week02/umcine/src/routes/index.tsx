import { movies } from "../data/movies";
import MovieGrid from "../components/movies/movie-grid";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className='px-[84px] py-[24px]'>
      <MovieGrid movies={movies} />
    </div>
  )
}