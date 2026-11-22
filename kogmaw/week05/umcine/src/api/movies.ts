import type { MovieDetail, MoviePage } from '../types/movie';
import { tmdbClient } from './tmdb-client';

export class MovieNotFoundError extends Error {
  constructor() {
    super('영화를 찾을 수 없어요.');
    this.name = 'MovieNotFoundError';
  }
}

export function getPopularMovies(page: number, signal?: AbortSignal) {
  return tmdbClient.get('movie/popular', { searchParams: { page }, signal }).json<MoviePage>();
}

export function searchMovies(query: string, page: number, signal?: AbortSignal) {
  return tmdbClient
    .get('search/movie', {
      searchParams: { query, page, include_adult: false },
      signal,
    })
    .json<MoviePage>();
}

export function getMovieDetail(movieId: string, signal?: AbortSignal) {
  if (!/^\d+$/.test(movieId) || !Number.isSafeInteger(Number(movieId)) || Number(movieId) <= 0) {
    throw new MovieNotFoundError();
  }

  return tmdbClient.get(`movie/${movieId}`, { signal }).json<MovieDetail>();
}
