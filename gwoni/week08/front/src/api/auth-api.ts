import { useAuthStore } from "../stores/auth-store";
import { apiClient } from "./api-client";

// apiClient 설정(baseUrl)을 이어받고, 인증 처리만 더한 인스턴스
export const authApi = apiClient.extend({
  hooks: {
    beforeRequest: [
      ({ request }) => {
        // 요청 직전에 최신 토큰을 읽어 헤더에 넣어요. (컴포넌트 밖이라 getState 사용)
        const { accessToken } = useAuthStore.getState();
        if (accessToken) {
          request.headers.set("Authorization", `Bearer ${accessToken}`);
        }
      },
    ],
    afterResponse: [
      ({ response }) => {
        // 토큰 없음/위조/만료(AUTH401_2/3/4)면 저장된 토큰을 비워요.
        if (response.status === 401) {
          useAuthStore.getState().clearAuth();
        }
      },
    ],
  },
});
