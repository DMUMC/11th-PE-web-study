import type { MemberRating } from "../members/models";
import { authApi } from "../auth-api";

interface ApiResult<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
}

export interface CreateRatingRequest {
  movieId: number;
  score: number;
  comment: string;
}

export interface UpdateRatingRequest {
  ratingId: number;
  score: number;
  comment: string;
}

export function createRating(body: CreateRatingRequest) {
  return authApi.post("ratings", { json: body }).json<ApiResult<MemberRating>>();
}

export function updateRating({ ratingId, ...body }: UpdateRatingRequest) {
  return authApi
    .patch(`ratings/${ratingId}`, { json: body })
    .json<ApiResult<MemberRating>>();
}

export function deleteRating(ratingId: number) {
  return authApi.delete(`ratings/${ratingId}`).json<ApiResult<null>>();
}
