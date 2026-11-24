import ky from "ky";
import { env } from "../config/env";

// 재시도는 TanStack Query가 맡으므로 ky에서는 하지 않는다.
export const tmdbClient = ky.create({
  baseUrl: `${env.tmdbApiBaseUrl}/`,
  headers: {
    Authorization: `Bearer ${env.tmdbAccessToken}`,
  },
  retry: 0,
});
