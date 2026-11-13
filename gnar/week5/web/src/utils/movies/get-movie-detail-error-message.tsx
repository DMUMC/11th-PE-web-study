import { HTTPError } from "ky";

export function getMovieDetailErrorMessage(
  error: unknown,
): string {
  if (error instanceof HTTPError) {
    if (error.response.status === 404) {
      return "영화를 찾을 수 없어요.";
    }

    if (error.response.status === 401) {
      return "인증에 실패했어요. TMDB 토큰을 확인해주세요.";
    }
  }

  return "영화 정보를 불러오지 못했어요.";
}