import ky from "ky";
import { env } from "../config/env";
import { getTmdbAuth } from "./tmdb-auth";

export function getTmdbClient() {
  if (!env.tmdbApiBaseUrl) {
    throw new Error("NEXT_PUBLIC_TMDB_API_BASE_URL 환경 변수가 필요해요.");
  }

  const { headers } = getTmdbAuth();
  return ky.create({
    baseUrl: `${env.tmdbApiBaseUrl}/`,
    headers,
  });
}