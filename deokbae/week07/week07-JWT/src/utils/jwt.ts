// 화면 표시용 디코딩이에요. 서명 검증이 아니라서 권한 판단에는 쓰면 안 돼요
interface JwtPayload {
  sub: string;
  email: string;
  exp: number;
  iat: number;
}

export function decodeJwt(token: string): JwtPayload | null {
  try {
    const payload = token.split(".")[1];
    // JWT는 Base64URL이라 일반 Base64로 바꿔서 디코딩해요
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
        .join(""),
    );
    return JSON.parse(json) as JwtPayload;
  } catch {
    return null;
  }
}

export function getMemberIdFromToken(token: string | null): number | null {
  if (!token) return null;
  const payload = decodeJwt(token);
  if (!payload) return null;
  const id = Number(payload.sub);
  return Number.isInteger(id) && id > 0 ? id : null;
}