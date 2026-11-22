export interface ApiResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
}

export async function readApiResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const body = await response.text();
    throw new Error(body || `요청에 실패했어요. (${response.status})`);
  }

  const payload: ApiResponse<T> = await response.json();
  if (!payload.isSuccess) {
    throw new Error(payload.message || "요청에 실패했어요.");
  }

  return payload.result;
}
