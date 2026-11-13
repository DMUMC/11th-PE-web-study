import ky, { HTTPError, NetworkError, TimeoutError } from 'ky';
import type { Movie } from '../types/movie';

const BASE = 'https://api.themoviedb.org/3';
const token = import.meta.env.VITE_TMDB_READ_TOKEN?.trim();
const headers = { Authorization: `Bearer ${token ?? ''}`, Accept: 'application/json' };
const api = ky.create({ headers, timeout: 10000, retry: 0 });

interface ApiMovie {
  id: number;
  title: string;
  original_title: string;
  release_date?: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  genres?: { id: number; name: string }[];
  runtime?: number | null;
  tagline?: string;
}
interface MovieResponse { results: ApiMovie[]; page: number; total_pages: number; total_results: number }
export interface MoviePage { movies: Movie[]; page: number; totalPages: number; totalResults: number }
function requireToken() {
  if (!token) throw new Error('TMDB 연결 설정이 필요합니다. API Read Access Token을 설정해 주세요.');
}
export function imageUrl(path: string | null, size: 'w500' | 'original' = 'w500') {
  return path ? `https://image.tmdb.org/t/p/${size}${path}` : '/images/no-poster.svg';
}
export function toMovie(movie: ApiMovie): Movie {
  return {
    id: movie.id, title: movie.title, originalTitle: movie.original_title,
    releaseDate: movie.release_date ?? '', posterPath: imageUrl(movie.poster_path),
    backdropPath: imageUrl(movie.backdrop_path, 'original'),
    genres: movie.genres?.map(genre => genre.name) ?? [],
    runtime: movie.runtime ? `${movie.runtime}분` : '상영시간 정보 없음',
    tagline: movie.tagline ?? '', overview: movie.overview || '등록된 줄거리가 없습니다.',
    isBookmarked: false,
  };
}
function toPage(data: MovieResponse): MoviePage {
  return { movies: data.results.map(toMovie), page: data.page, totalPages: Math.min(data.total_pages, 500), totalResults: data.total_results };
}
export async function fetchPopularMovies(signal?: AbortSignal) {
  requireToken();
  const response = await fetch(`${BASE}/movie/popular?language=ko-KR&page=1`, { headers, signal });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return await response.json() as MovieResponse;
}
export async function getPopularMovies(page: number, signal: AbortSignal) {
  requireToken();
  return toPage(await api.get(`${BASE}/movie/popular`, { searchParams: { language: 'ko-KR', page }, signal }).json<MovieResponse>());
}
export async function searchMovies(query: string, signal: AbortSignal) {
  if (!query.trim()) return { movies: [], page: 1, totalPages: 0, totalResults: 0 };
  requireToken();
  return toPage(await api.get(`${BASE}/search/movie`, { searchParams: { language: 'ko-KR', query, page: 1, include_adult: false }, signal }).json<MovieResponse>());
}
export async function getMovie(movieId: string, signal: AbortSignal) {
  if (!/^[1-9]\d*$/.test(movieId)) throw new Error('올바르지 않은 영화 ID입니다.');
  requireToken();
  return toMovie(await api.get(`${BASE}/movie/${movieId}`, { searchParams: { language: 'ko-KR' }, signal }).json<ApiMovie>());
}
export function errorMessage(error: unknown): string {
  if (error instanceof HTTPError) {
    if (error.response.status === 401) return '인증에 실패했습니다. TMDB 토큰을 확인해 주세요.';
    if (error.response.status === 404) return '영화를 찾을 수 없습니다.';
    if (error.response.status === 429) return '요청이 많습니다. 잠시 후 다시 시도해 주세요.';
    return `서버 요청에 실패했습니다. (HTTP ${error.response.status})`;
  }
  if (error instanceof TimeoutError) return '응답 시간이 초과되었습니다. 다시 시도해 주세요.';
  if (error instanceof NetworkError || error instanceof TypeError) return '서버에 연결할 수 없습니다. 네트워크를 확인하고 다시 시도해 주세요.';
  return error instanceof Error ? error.message : '데이터를 불러오지 못했습니다.';
}
