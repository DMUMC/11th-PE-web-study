const tmdbApiBaseUrl =
  import.meta.env.VITE_TMDB_API_BASE_URL?.trim();

const tmdbAccessToken =
  import.meta.env.VITE_TMDB_ACCESS_TOKEN?.trim();

if (!tmdbApiBaseUrl || !tmdbAccessToken) {
  throw new Error(
    ".env.local에 TMDB 주소와 API Read Access Token을 설정해주세요.",
  );
}

export const env = {
  // 마지막 /를 제거해 주소가 중복으로 연결되지 않게 합니다.
  tmdbApiBaseUrl: tmdbApiBaseUrl.replace(/\/+$/, ""),
  tmdbAccessToken,
};