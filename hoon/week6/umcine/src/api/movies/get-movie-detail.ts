import { tmdbClient } from "../tmdb-client";
import type { TmdbMovieDetail } from "./models";
import { getMockMovieDetail } from "./mock-movies";

type GetMovieDetailResponse = TmdbMovieDetail;

async function getMovieDetail(movieId: number) {
  try {
    return await tmdbClient
      .get(`movie/${movieId}`, {
        searchParams: { language: "ko-KR" },
      })
      .json<GetMovieDetailResponse>();
  } catch (error) {
    console.warn("TMDB API request failed, using mock data fallback:", error);
    return getMockMovieDetail(movieId);
  }
}

export { getMovieDetail, type GetMovieDetailResponse };
