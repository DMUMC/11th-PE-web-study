// src/api/member-api.ts

import type {
  CheckResponse,
  RatingResponse,
} from "../types/member";

// 실습에서 만든 Spring Boot 서버 주소
export const API_BASE_URL = "http://localhost:8080";

// HTTP 오류의 상태 코드를 보관합니다.
export class ApiError extends Error {
  readonly status: number;

  constructor(status: number) {
    super(`요청에 실패했습니다. HTTP ${status}`);

    this.name = "ApiError";
    this.status = status;
  }
}

// 공통 GET 요청 함수
async function get<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`);

  if (!response.ok) {
    throw new ApiError(response.status);
  }

  return (await response.json()) as T;
}

// 닉네임 중복 확인
export function checkNickname(
  nickname: string,
): Promise<CheckResponse> {
  return get<CheckResponse>(
    `/members/nickname/${encodeURIComponent(nickname)}`,
  );
}

// 이메일 중복 확인
export function checkEmail(
  email: string,
): Promise<CheckResponse> {
  return get<CheckResponse>(
    `/members/email/${encodeURIComponent(email)}`,
  );
}

// 회원별 평점 조회
export function getMemberRatings(
  memberId: string,
): Promise<RatingResponse[]> {
  return get<RatingResponse[]>(
    `/members/${encodeURIComponent(memberId)}/ratings`,
  );
}

// 화면에 표시할 오류 메시지
export function getApiErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    return error.message;
  }

  if (error instanceof TypeError) {
    return (
      "서버에 연결할 수 없습니다. " +
      "백엔드 실행 상태와 CORS 설정을 확인하세요."
    );
  }

  return error instanceof Error
    ? error.message
    : "알 수 없는 오류가 발생했습니다.";
}