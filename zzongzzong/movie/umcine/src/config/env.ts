const tmdbApiBaseUrl = process.env.NEXT_PUBLIC_TMDB_API_BASE_URL;
const tmdbAccessToken = process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN;

if (!tmdbApiBaseUrl || !tmdbAccessToken) {
  throw new Error("NEXT_PUBLIC_TMDB_API_BASE_URL과 NEXT_PUBLIC_TMDB_ACCESS_TOKEN 환경 변수가 필요해요.");
}

export const env = {
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "",
  tmdbApiBaseUrl,
  tmdbAccessToken,
};
