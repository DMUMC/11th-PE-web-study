import ky from "ky";
import { assertTmdbEnv, env } from "../config/env";

export const tmdbClient = ky.create({
  baseUrl: env.tmdbApiBaseUrl ? `${env.tmdbApiBaseUrl}/` : undefined,
  headers: { Authorization: `Bearer ${env.tmdbAccessToken}` },
  hooks: { beforeRequest: [() => assertTmdbEnv()] },
});
