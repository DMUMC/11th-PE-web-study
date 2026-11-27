import ky from "ky";
import { env } from "../config/env";

// 우리 백엔드(Spring) 요청용 인스턴스다. TMDB와 주소와 인증 방식이 달라서 따로 만든다.
export const apiClient = ky.create({
  baseUrl: `${env.apiBaseUrl}/`,
  retry: 0,
});
