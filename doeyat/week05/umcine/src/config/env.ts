export const env = {
  tmdbApiBaseUrl: import.meta.env.VITE_TMDB_API_BASE_URL?.trim().replace(/\/+$/, "") ?? "",
  tmdbAccessToken: import.meta.env.VITE_TMDB_ACCESS_TOKEN?.trim() ?? "",
};

// 요청 시 검사하여 토큰이 없어도 검색 안내와 오류 화면은 표시할 수 있어요.
export function assertTmdbEnv() {
  if (!env.tmdbApiBaseUrl || !env.tmdbAccessToken) {
    throw new Error("TMDB 환경 변수가 필요해요. .env.local 설정 후 개발 서버를 다시 시작해 주세요.");
  }
}
