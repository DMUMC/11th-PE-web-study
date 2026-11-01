const tmdbApiBaseUrl = import.meta.env.VITE_TMDB_API_BASE_URL;
const tmdbAccessToken = import.meta.env.VITE_TMDB_ACCESS_TOKEN;
const backendApiBaseUrl =
  import.meta.env.VITE_BACKEND_API_BASE_URL ?? "http://localhost:8080";

if (!tmdbApiBaseUrl || !tmdbAccessToken) {
  throw new Error(
    "TMDB 환경 변수가 필요해요. .env.local에 VITE_TMDB_API_BASE_URL과 VITE_TMDB_ACCESS_TOKEN을 설정해 주세요.",
  );
}

export const env = {
  tmdbApiBaseUrl,
  tmdbAccessToken,
  backendApiBaseUrl,
};
