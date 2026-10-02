import { useState } from 'react';
import Header from './components/header';
import MovieGrid from './components/movie-grid';
import Pagination from './components/pagination';
import { movies } from './data/movies';
import type { Movie } from './types/movie';

export default function App() {
  const [movieList, setMovieList] = useState<Movie[]>(movies);

  function toggleBookmark(movieId: number) {
    // 이전 상태를 기준으로 선택한 영화만 새 객체로 교체한다.
    setMovieList((previousMovies) =>
      previousMovies.map((movie) =>
        movie.id === movieId
          ? { ...movie, isBookmarked: !movie.isBookmarked }
          : movie,
      ),
    );
  }

  return (
    <div className="app">
      <Header />
      <main className="main-container" id="movies">
        <h1>영화 목록</h1>
        <MovieGrid movies={movieList} onToggleBookmark={toggleBookmark} />
        <Pagination />
      </main>
      <footer className="footer">
        <div className="footer-content">
          <img src="/images/logos/tmdb-logo.svg" alt="TMDB" />
          <small>This product uses the TMDB API but is not endorsed or certified by TMDB.</small>
        </div>
      </footer>
    </div>
  );
}
