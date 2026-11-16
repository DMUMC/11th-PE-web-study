import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { useAuthStore } from "../../stores/auth-store";

// (protected) 폴더는 URL에 들어가지 않는 Route Group이에요.
// 이 Layout Route 아래 페이지(/my, /my/edit)는 로그인해야 들어갈 수 있어요.
export const Route = createFileRoute("/(protected)")({
  beforeLoad: () => {
    if (!useAuthStore.getState().accessToken) {
      throw redirect({ to: "/login" });
    }
  },
  component: () => <Outlet />,
});
