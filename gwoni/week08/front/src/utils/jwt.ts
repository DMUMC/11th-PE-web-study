// back/demo의 JwtProvider는 subject(sub)에 memberId를 넣어요.
// GET /members/{memberId}/ratings에 필요한 내 memberId를 토큰에서 꺼내요.
// (서명 검증은 서버가 해요. 여기서는 payload만 읽어요.)
export function getMemberIdFromToken(token: string | null): number | null {
  if (!token) return null;
  try {
    const payload = token.split(".")[1];
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const { sub } = JSON.parse(atob(base64)) as { sub?: string };
    const memberId = Number(sub);
    return Number.isInteger(memberId) && memberId > 0 ? memberId : null;
  } catch {
    return null;
  }
}
