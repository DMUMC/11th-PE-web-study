import { isHTTPError } from "ky";

export interface ApiResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
}

export function unwrap<T>(response: ApiResponse<T>): T {
  if (!response.isSuccess) throw new Error(response.message);
  return response.result;
}

export function apiErrorMessage(error: unknown, fallback: string) {
  const body = isHTTPError(error) ? error.data : null;
  return body && typeof body === "object" && "message" in body && typeof body.message === "string"
    ? body.message
    : fallback;
}
