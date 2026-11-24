import Header from "./components/header";
import Pagination from "./components/pagination";
import { movies } from "./data/movies";

export default function App() {
  return (
    <>
      <Header />
      <h1>영화 목록</h1>
      <Pagination movies={movies} />
    </>
  );
}
