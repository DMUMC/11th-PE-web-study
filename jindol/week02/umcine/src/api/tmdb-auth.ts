import { env } from "../config/env";

const usesApiKeyQuery = /^[a-f\d]{32}$/i.test(env.tmdbAccessToken);

const tmdbAuthHeaders: Record<string, string> = usesApiKeyQuery
  ? {}
  : { Authorization: `Bearer ${env.tmdbAccessToken}` };

const tmdbAuthSearchParams: Record<string, string> = usesApiKeyQuery
  ? { api_key: env.tmdbAccessToken }
  : {};

export { tmdbAuthHeaders, tmdbAuthSearchParams };