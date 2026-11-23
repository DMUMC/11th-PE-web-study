// src/types/member.ts

// 닉네임·이메일 중복 확인 응답
export interface CheckResponse {
  available: boolean;
}

// 회원별 평점 조회 응답
export interface RatingResponse {
  ratingId: number;
  movieId: number;
  score: number;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
}