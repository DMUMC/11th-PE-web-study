const POSTER_BASE_URL = "https://image.tmdb.org/t/p/w500";
const BACKDROP_BASE_URL = "https://image.tmdb.org/t/p/w1280";

export function getTmdbPosterUrl(
  posterPath: string | null,
): string | null {
  return posterPath ? `${POSTER_BASE_URL}${posterPath}` : null;
}

export function getTmdbBackdropUrl(
  backdropPath: string | null,
): string | null {
  return backdropPath ? `${BACKDROP_BASE_URL}${backdropPath}` : null;
}