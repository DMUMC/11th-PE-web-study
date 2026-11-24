import ky from "ky";
import { env } from "../../../config/env";

// baseUrl 끝에 "/"를 붙이고, 요청 path는 "movie/popular"처럼 "/" 없이 작성해요.
export const tmdbClient = ky.create({
  baseUrl: `${env.tmdbApiBaseUrl}/`,
  headers: {
    Authorization: `Bearer ${env.tmdbAccessToken}`,
  },
});
