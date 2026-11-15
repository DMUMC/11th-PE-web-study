import { isHTTPError } from "ky";
import type { MovieDetail, MoviePage, Movie } from "../../../types/movie";
import type { MoviePort } from "../../port/movie-port";
import { tmdbClient } from "./client";
import type {
  TmdbMovie,
  TmdbMovieDetail,
  TmdbMovieListResponse,
} from "./models";

const LANGUAGE = "ko-KR";
const TMDB_POSTER_BASE_URL = "https://image.tmdb.org/t/p/w500";
const TMDB_BACKDROP_BASE_URL = "https://image.tmdb.org/t/p/w1280";

// ── TMDB 응답 → DTO 변환 (mapper) ──

function toImageUrl(baseUrl: string, path: string | null) {
  return path ? `${baseUrl}${path}` : undefined;
}

// "2026-07-29" → "2026.07.29"
function formatReleaseDate(releaseDate: string) {
  return releaseDate.replaceAll("-", ".");
}

// 145 → "2시간 25분"
function formatRuntime(runtime: number | null) {
  if (!runtime) return null;

  const hours = Math.floor(runtime / 60);
  const minutes = runtime % 60;

  if (hours === 0) return `${minutes}분`;
  if (minutes === 0) return `${hours}시간`;
  return `${hours}시간 ${minutes}분`;
}

function toMovie(movie: TmdbMovie): Movie {
  return {
    id: movie.id,
    title: movie.title,
    originalTitle: movie.original_title,
    releaseDate: formatReleaseDate(movie.release_date),
    posterPath: toImageUrl(TMDB_POSTER_BASE_URL, movie.poster_path),
    overview: movie.overview,
  };
}

function toMoviePage(response: TmdbMovieListResponse): MoviePage {
  return {
    page: response.page,
    totalPages: response.total_pages,
    totalResults: response.total_results,
    movies: response.results.map(toMovie),
  };
}

function toMovieDetail(movie: TmdbMovieDetail): MovieDetail {
  return {
    ...toMovie(movie),
    backdropPath: toImageUrl(TMDB_BACKDROP_BASE_URL, movie.backdrop_path),
    genres: movie.genres.map((genre) => genre.name),
    runtime: formatRuntime(movie.runtime),
    tagline: movie.tagline,
  };
}

// ── MoviePort 구현 (TMDB 호출) ──

export const tmdbMovieAdapter: MoviePort = {
  async getPopularMovies(page = 1) {
    const response = await tmdbClient
      .get("movie/popular", {
        searchParams: { language: LANGUAGE, page },
      })
      .json<TmdbMovieListResponse>();

    return toMoviePage(response);
  },

  async searchMovies(query, page = 1) {
    const response = await tmdbClient
      .get("search/movie", {
        searchParams: {
          query,
          language: LANGUAGE,
          include_adult: false,
          page,
        },
      })
      .json<TmdbMovieListResponse>();

    return toMoviePage(response);
  },

  async getMovieDetail(movieId) {
    try {
      const response = await tmdbClient
        .get(`movie/${movieId}`, {
          searchParams: { language: LANGUAGE },
        })
        .json<TmdbMovieDetail>();

      return toMovieDetail(response);
    } catch (error) {
      // 404는 "영화 없음"으로 바꾸고, 나머지 오류는 그대로 던져요.
      if (isHTTPError(error) && error.response.status === 404) {
        return null;
      }
      throw error;
    }
  },
};
