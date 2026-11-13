import { useState } from "react";
import type { FormEvent } from "react";
import {
  Link,
  Navigate,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import MovieListPage from "./pages/movies/movie-list-page";
import SearchPage from "./pages/movies/search-page";
import MovieDetailPage from "./pages/movies/movie-detail-page";

export default function App() {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState("");

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const query = searchInput.trim();
    const searchParams = new URLSearchParams();

    if (query) {
      searchParams.set("query", query);
    }

    const search = searchParams.toString();
    navigate(search ? `/search?${search}` : "/search");
  }

  return (
    <div className="app">
      <header className="site-header">
        <Link to="/movies" className="brand">
          UMCine
        </Link>

        <nav className="site-nav" aria-label="주 메뉴">
          <Link to="/movies">인기 영화</Link>
          <Link to="/search">영화 검색</Link>
        </nav>

        <form className="search-form" onSubmit={handleSearch}>
          <input
            type="search"
            aria-label="영화 제목"
            placeholder="영화 제목을 입력하세요"
            value={searchInput}
            onChange={(event) => {
              setSearchInput(event.target.value);
            }}
          />
          <button type="submit">검색</button>
        </form>
      </header>

      <main className="main-content">
        <Routes>
          <Route
            path="/"
            element={<Navigate to="/movies" replace />}
          />
          <Route
            path="/movies"
            element={<MovieListPage />}
          />
          <Route
            path="/search"
            element={<SearchPage />}
          />
          <Route
            path="/movies/:movieId"
            element={<MovieDetailPage />}
          />
          <Route
            path="*"
            element={
              <section>
                <h1>페이지를 찾을 수 없어요.</h1>
                <Link to="/movies">영화 목록으로 이동</Link>
              </section>
            }
          />
        </Routes>
      </main>

      <footer className="site-footer">
        <a
          href="https://www.themoviedb.org/"
          target="_blank"
          rel="noreferrer"
          aria-label="TMDB 홈페이지"
        >
          <img
            className="tmdb-logo"
            src="/tmdb-logo.svg"
            alt="TMDB"
          />
        </a>

        <p>
          This product uses the TMDB API but is not endorsed or
          certified by TMDB.
        </p>
      </footer>
    </div>
  );
}