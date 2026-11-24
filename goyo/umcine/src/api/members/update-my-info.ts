
import { apiClient } from "../api-client";
import type { GetMyInfoResponse } from "./get-my-info";

export interface UpdateMyInfoRequest {
  nickname: string;
}

export function updateMyInfo(body: UpdateMyInfoRequest) {
  const token = localStorage.getItem("accessToken");

  return apiClient
    .patch("members/me", {
      headers: {
        Authorization: `Bearer ${token ?? ""}`,
      },
      json: body,
    })
    .json<GetMyInfoResponse>();
}
