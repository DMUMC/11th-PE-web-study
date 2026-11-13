import ky, { isHTTPError } from "ky";
import { env } from "../config/env";
import { useAuthStore } from "../stores/auth-store";

// 회원 서버(back/demo)의 공통 응답 형식
export interface ApiResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
}

export const apiClient = ky.create({
  baseUrl: env.apiBaseUrl,
  hooks: {
    beforeRequest: [
      ({ request }) => {
        // 토큰이 있으면 Authorization: Bearer {token} 헤더를 붙여요.
        const { accessToken } = useAuthStore.getState();
        if (accessToken) {
          request.headers.set("Authorization", `Bearer ${accessToken}`);
        }
      },
    ],
  },
});

// 실패 응답 본문의 message를 꺼내요. 없으면 fallback을 써요.
export function getApiErrorMessage(error: unknown, fallback: string) {
  if (isHTTPError(error)) {
    const data = error.data as Partial<ApiResponse<unknown>> | undefined;
    if (data && typeof data === "object" && data.message) return data.message;
  }
  return fallback;
}

// 실패 응답의 HTTP 상태 코드를 꺼내요.
export function getApiErrorStatus(error: unknown) {
  return isHTTPError(error) ? error.response.status : undefined;
}
