import './App.css'

import Header from "./components/header";
import MovieGrid from "./components/movie-grid";
import Pagination from "./components/pagination";

export default function App() {
  return (
    <>
    <Header />
    <main>
      <MovieGrid />
      <Pagination />
    </main>
    </>
  );
}
