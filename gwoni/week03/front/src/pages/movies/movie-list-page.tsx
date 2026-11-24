import Pagination from "../../components/pagination";
import { movies } from "../../data/movies";

export function MovieListPage() {
  return (
    <>
      <h1>영화 목록</h1>
      <Pagination movies={movies} />
    </>
  );
}
