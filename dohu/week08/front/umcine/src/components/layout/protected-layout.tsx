import { Navigate, Outlet } from "@tanstack/react-router";
import { useAuthStore } from "../../stores/auth-store";

export function ProtectedLayout() {
  const accessToken = useAuthStore((state) => state.accessToken);

  // 페이지를 보는 중에 401이나 로그아웃으로 토큰이 지워지면 로그인 화면으로 보낸다.
  if (!accessToken) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
}
