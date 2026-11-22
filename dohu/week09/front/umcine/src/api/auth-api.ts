import { useAuthStore } from "../stores/auth-store";
import { apiClient } from "./api-client";

// 공통 서버 주소는 apiClient에서 이어받고, 인증이 필요한 요청에만 토큰을 붙인다.
export const authApi = apiClient.extend({
  hooks: {
    beforeRequest: [
      ({ request }) => {
        // 컴포넌트 밖이라 훅 대신 getState()로 최신 토큰을 읽는다.
        const accessToken = useAuthStore.getState().accessToken;
        if (accessToken) {
          request.headers.set("Authorization", `Bearer ${accessToken}`);
        }
      },
    ],
    afterResponse: [
      ({ response }) => {
        // 만료되거나 잘못된 토큰이면 지워서 로그인 전 상태로 돌린다.
        if (response.status === 401) {
          useAuthStore.getState().setAccessToken(null);
        }
      },
    ],
  },
});
