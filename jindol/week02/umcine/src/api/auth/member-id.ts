import { useAuthStore } from "../../stores/auth-store";

export function getCurrentMemberId(): number | null {
  const accessToken = useAuthStore.getState().accessToken;
  if (!accessToken) return null;

  try {
    const payload = accessToken.split(".")[1];
    if (!payload) return null;

    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = atob(base64.padEnd(Math.ceil(base64.length / 4) * 4, "="));
    const subject: unknown = JSON.parse(decoded).sub;
    const memberId = typeof subject === "string" ? Number(subject) : subject;
    return typeof memberId === "number" && Number.isSafeInteger(memberId) && memberId > 0
      ? memberId
      : null;
  } catch {
    return null;
  }
}
