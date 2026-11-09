import ky from "ky";
import { env } from "../config/env";
import { useAuthStore } from "@/stores/auth-store";

export const apiClient = ky.create({
  baseUrl: env.apiBaseUrl,
  hooks: {
    beforeRequest: [
      ({ request }) => {
        const token = useAuthStore.getState().accessToken;
        if (token) {
          request.headers.set("Authorization", `Bearer ${token}`);
        }
      },
    ],
    afterResponse: [
      ({ response }) => {
        // 토큰이 있는데 401이면 만료된 것으로 보고 로그아웃 처리
        if (
          response.status === 401 &&
          useAuthStore.getState().accessToken
        ) {
          useAuthStore.getState().logout();
        }
      },
    ],
  },
});