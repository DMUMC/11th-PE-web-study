import { apiClient } from "../api-client";
import { useAuthStore } from "../../stores/auth-store";

export interface MemberInfo {
  memberId: number;
  email: string;
  nickname: string;
  createdAt?: string;
}

export interface GetMyInfoResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: MemberInfo;
}

type RawGetMyInfoResponse = Omit<
  GetMyInfoResponse,
  "result"
> & {
  result: Omit<MemberInfo, "memberId"> & {
    memberId?: number;
  };
};

function getMemberIdFromToken(token: string): number {
  try {
    const payload = token.split(".")[1];

    const base64 = payload
      .replace(/-/g, "+")
      .replace(/_/g, "/");

    const decoded = JSON.parse(atob(base64));
    const memberId = Number(decoded.sub);

    if (!Number.isInteger(memberId) || memberId <= 0) {
      throw new Error("잘못된 회원 ID입니다.");
    }

    return memberId;
  } catch {
    throw new Error("회원 ID를 확인할 수 없습니다.");
  }
}

export async function getMyInfo(): Promise<GetMyInfoResponse> {
  const token = useAuthStore.getState().accessToken;

  if (!token) {
    throw new Error("로그인이 필요합니다.");
  }

  const response = await apiClient
    .get("members/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .json<RawGetMyInfoResponse>();

  if (!response.isSuccess || !response.result) {
    throw new Error(response.message);
  }

  return {
    ...response,
    result: {
      ...response.result,
      memberId:
        response.result.memberId ??
        getMemberIdFromToken(token),
    },
  };
}