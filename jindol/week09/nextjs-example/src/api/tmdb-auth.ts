import { env } from "../config/env";

export function getTmdbAuth() {
  const accessToken = env.tmdbAccessToken;
  if (!accessToken) {
    throw new Error("NEXT_PUBLIC_TMDB_ACCESS_TOKEN 환경 변수가 필요해요.");
  }

  const usesApiKeyQuery = /^[a-f\d]{32}$/i.test(accessToken);
  const headers: Record<string, string> = usesApiKeyQuery
    ? {}
    : { Authorization: `Bearer ${accessToken}` };
  const searchParams: Record<string, string> = usesApiKeyQuery
    ? { api_key: accessToken }
    : {};

  return {
    headers,
    searchParams,
  };
}