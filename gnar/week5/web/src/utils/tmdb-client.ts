import ky from "ky";
import { env } from "../config/env";

export const tmdbClient = ky.create({
  // 아래 옵션은 설치한 ky 1.14.0 문법입니다.
  prefixUrl: `${env.tmdbApiBaseUrl}/`,

  headers: {
    Authorization: `Bearer ${env.tmdbAccessToken}`,
  },

  timeout: 10000,

  // 실습에서 요청과 오류 흐름을 명확히 확인하도록 자동 재시도를 끕니다.
  retry: 0,
});