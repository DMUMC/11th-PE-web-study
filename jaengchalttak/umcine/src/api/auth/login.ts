import { apiClient } from "../api-client";
import { unwrap, type ApiResponse } from "../api-response";

export interface LoginRequest { email: string; password: string }

export async function login(body: LoginRequest) {
  return unwrap(await apiClient.post("auth/login", { json: body })
    .json<ApiResponse<{ nickname: string; accessToken: string }>>());
}
