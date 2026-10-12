import ky from "ky";
import { env } from "../config/env";
import { tmdbAuthHeaders } from "./tmdb-auth";

export const tmdbClient = ky.create({
  baseUrl: `${env.tmdbApiBaseUrl}/`,
  headers: tmdbAuthHeaders,
});