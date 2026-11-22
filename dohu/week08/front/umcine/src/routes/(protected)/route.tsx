import { createFileRoute, redirect } from "@tanstack/react-router";
import { ProtectedLayout } from "../../components/layout/protected-layout";
import { useAuthStore } from "../../stores/auth-store";

// 괄호 폴더는 주소에 들어가지 않는다. 로그인 후에만 볼 수 있는 페이지를 이 폴더에 모으고
// 화면을 그리기 전에 토큰이 없으면 로그인으로 보낸다.
export const Route = createFileRoute("/(protected)")({
  beforeLoad: () => {
    if (!useAuthStore.getState().accessToken) {
      throw redirect({ to: "/login" });
    }
  },
  component: ProtectedLayout,
});
