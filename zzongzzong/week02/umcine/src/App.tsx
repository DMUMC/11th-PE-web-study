import { movies } from "./data/movies";
import Footer from "./footer";
import Header from "./header";
import MovieGrid from "./movie-grid";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-[#f6f7f9] px-[80px] py-[24px]">
        <p className="text-[38px] font-[700]">영화 목록</p>
        <MovieGrid movies={movies} />
      </main>
      <Footer />
    </div>
  );
}