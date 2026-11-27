import { isHTTPError } from "ky";

export function RequestMessage({ children, error }: { children: React.ReactNode; error?: unknown }) {
  const data = isHTTPError(error) ? error.data : null;
  const needsConfig = data !== null && typeof data === "object" && "code" in data && data.code === "TMDB_CONFIG_REQUIRED";
  return (
    <div className="px-5 py-16 text-center text-[#676d76]" role={error ? "alert" : "status"}>
      <p>{children}</p>
      {needsConfig && (
        <p className="mt-3 text-sm">TMDB 환경 변수가 필요해요. .env.local 설정 후 개발 서버를 다시 시작해 주세요.</p>
      )}
    </div>
  );
}
