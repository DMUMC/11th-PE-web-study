import { useMemo } from "react";
import { MovieGrid } from "../../components/movies/movie-grid";
import { movies } from "../../data/movies";
import { usePreferenceStore } from "../../stores/preference-store";

export function MovieListPage() {
  const { cardSize, setCardSize, sortBy, setSortBy } = usePreferenceStore();

  const sortedMovies = useMemo(() => {
    return [...movies].sort((a, b) => {
      if (sortBy === "title") {
        return a.title.localeCompare(b.title, "ko");
      }
      return b.releaseDate.localeCompare(a.releaseDate);
    });
  }, [sortBy]);

  return (
    <main className="mx-auto w-full max-w-[1280px] px-10 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h1 className="text-[28px] font-bold text-gray-900">영화 목록</h1>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center rounded-lg border border-gray-200 bg-white p-1 shadow-sm text-sm">
            <button
              type="button"
              onClick={() => setSortBy("latest")}
              className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                sortBy === "latest"
                  ? "bg-[#5267e9] text-white font-medium"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              최신순
            </button>
            <button
              type="button"
              onClick={() => setSortBy("title")}
              className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                sortBy === "title"
                  ? "bg-[#5267e9] text-white font-medium"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              이름순
            </button>
          </div>

          <div className="flex items-center rounded-lg border border-gray-200 bg-white p-1 shadow-sm text-sm">
            <button
              type="button"
              onClick={() => setCardSize("normal")}
              className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                cardSize === "normal"
                  ? "bg-[#5267e9] text-white font-medium"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              기본 크기
            </button>
            <button
              type="button"
              onClick={() => setCardSize("large")}
              className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                cardSize === "large"
                  ? "bg-[#5267e9] text-white font-medium"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              크게 보기
            </button>
          </div>
        </div>
      </div>
      <MovieGrid movies={sortedMovies} />
    </main>
  );
}

export default MovieListPage;
