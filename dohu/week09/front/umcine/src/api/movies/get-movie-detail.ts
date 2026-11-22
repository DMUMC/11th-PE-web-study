import ky from "ky";
import type { TmdbMovieDetail } from "./models";

// 브라우저에서는 TMDB를 직접 부르지 않고 Next.js Route Handler를 거친다.
export function getMovieDetail(movieId: number) {
  return ky.get(`/api/movies/${movieId}`, { retry: 0 }).json<TmdbMovieDetail>();
}
