import type { MoviePort } from "./port/movie-port";
import { tmdbMovieAdapter } from "./tmdb/adapter/adapter";

// 화면은 여기서 movieApi만 가져다 써요. 구현체를 바꿀 때는 이 줄만 바꿔요.
export const movieApi: MoviePort = tmdbMovieAdapter;
