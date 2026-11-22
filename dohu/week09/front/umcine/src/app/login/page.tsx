import type { Metadata } from "next";
import { LoginPage } from "@/views/auth/login-page";

// metadata는 Server Component에서만 내보낼 수 있어서 페이지 파일은 서버에 두고 폼만 Client Component로 쓴다.
export const metadata: Metadata = { title: "로그인" };

export default function Page() {
  return <LoginPage />;
}
