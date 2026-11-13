import { apiClient } from "../api-client";
import type { ApiResponse } from "../api-response";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResult {
  nickname: string;
  accessToken: string;
}

export function login(body: LoginRequest) {
  return apiClient
    .post("auth/login", { json: body })
    .json<ApiResponse<LoginResult>>();
}