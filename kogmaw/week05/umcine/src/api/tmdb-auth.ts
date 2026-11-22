export const TMDB_API_URL = 'https://api.themoviedb.org/3/';

export class TmdbConfigurationError extends Error {
  constructor() {
    super('영화 서비스 연결 설정이 필요합니다.');
    this.name = 'TmdbConfigurationError';
  }
}

export function getTmdbHeaders(): Record<string, string> {
  const token = import.meta.env.VITE_TMDB_READ_ACCESS_TOKEN?.trim();

  if (!token) throw new TmdbConfigurationError();

  return {
    accept: 'application/json',
    Authorization: `Bearer ${token}`,
  };
}
