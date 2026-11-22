import ky, { isHTTPError, isNetworkError } from "ky";
import { useAuthStore } from "../stores/auth-store";

const configuredUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export const apiClient = ky.create({
  baseUrl: `${configuredUrl.replace(/\/+$/, "")}/`,
  retry: 0,
});

export const authApi = apiClient.extend({
  hooks: {
    beforeRequest: [
      ({ request }) => {
        const { accessToken } = useAuthStore.getState();
        if (accessToken) request.headers.set("Authorization", `Bearer ${accessToken}`);
      },
    ],
    afterResponse: [
      ({ request, response }) => {
        const { accessToken, setAccessToken } = useAuthStore.getState();
        if (
          response.status === 401 &&
          accessToken &&
          request.headers.get("Authorization") === `Bearer ${accessToken}`
        ) {
          setAccessToken(null);
        }
      },
    ],
  },
});

export interface ApiResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
}

export function getApiErrorMessage(error: unknown): string {
  if (isHTTPError<{ message?: string }>(error)) {
    const message = typeof error.data === "object" ? error.data?.message : undefined;
    return message ?? `요청에 실패했습니다. HTTP ${error.response.status}`;
  }

  if (isNetworkError(error)) {
    return "서버에 연결할 수 없습니다. 백엔드 실행 상태와 서버 주소를 확인하세요.";
  }

  return error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.";
}
