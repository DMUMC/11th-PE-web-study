// NEXT_PUBLIC_로 시작하는 값은 빌드할 때 브라우저 코드에 그대로 들어간다.
const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!apiBaseUrl) {
  throw new Error("백엔드 API 환경 변수가 필요해요.");
}

export const env = { apiBaseUrl };
