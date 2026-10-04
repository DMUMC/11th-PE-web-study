import { useState } from 'react';
import './App.css';
import { Header } from './components/header';
import { MovieGrid } from './components/movie-grid';
import { Pagination } from './components/pagination';
import { movies as initialMovies } from './data/movies';

function App() {
  const [movies, setMovies] = useState(initialMovies);

  const handleBookmarkToggle = (movieId: number) => {
    setMovies((currentMovies) =>
      currentMovies.map((movie) =>
        movie.id === movieId
          ? { ...movie, isBookmarked: !movie.isBookmarked }
          : movie,
      ),
    );
  };

  return (
    <div className="app">
      <Header />

      <main className="movie-list-page">
        <div className="movie-list-content">
          <h1>영화 목록</h1>
          <MovieGrid movies={movies} onBookmarkToggle={handleBookmarkToggle} />
          <Pagination currentPage={1} totalPages={1} />
        </div>
      </main>
    </div>
  );
}

export default App;
