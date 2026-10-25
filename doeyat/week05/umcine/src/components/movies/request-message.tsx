import { env } from "../../config/env";

export function RequestMessage({ children, error = false, showConfigHint = true }: { children: React.ReactNode; error?: boolean; showConfigHint?: boolean }) {
  return (
    <div className="px-5 py-16 text-center text-[#676d76]" role={error ? "alert" : "status"}>
      <p>{children}</p>
      {error && showConfigHint && (!env.tmdbApiBaseUrl || !env.tmdbAccessToken) && (
        <p className="mt-3 text-sm">TMDB 환경 변수가 필요해요. .env.local 설정 후 개발 서버를 다시 시작해 주세요.</p>
      )}
    </div>
  );
}
