import type { MovieDetail, MoviePage } from "../../types/movie";

// 화면이 의존하는 영화 데이터 인터페이스예요. 어디서 가져오는지(TMDB 등)는 adapter가 결정해요.
export interface MoviePort {
  getPopularMovies(page?: number): Promise<MoviePage>;
  searchMovies(query: string, page?: number): Promise<MoviePage>;
  // 영화가 없으면 null을 반환해요.
  getMovieDetail(movieId: number): Promise<MovieDetail | null>;
}
