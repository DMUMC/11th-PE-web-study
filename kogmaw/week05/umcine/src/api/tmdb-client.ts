import ky from 'ky';
import { getTmdbHeaders, TMDB_API_URL } from './tmdb-auth';

// ky 2.x uses `baseUrl`/`prefix` rather than ky 1.x's `prefixUrl`.
export const tmdbClient = ky.create({
  baseUrl: TMDB_API_URL,
  searchParams: { language: 'ko-KR' },
  timeout: 15_000,
  retry: 0,
  hooks: {
    beforeRequest: [
      ({ request }) => {
        for (const [name, value] of Object.entries(getTmdbHeaders())) {
          request.headers.set(name, value);
        }
      },
    ],
  },
});
