import {
  createFileRoute,
  Outlet,
  redirect,
} from "@tanstack/react-router";

import { useAuthStore } from "../../stores/auth-store";

export const Route = createFileRoute("/(protected)/_layout")({
  beforeLoad: () => {
    const accessToken = useAuthStore.getState().accessToken;

    if (!accessToken) {
      throw redirect({
        href: "/login",
        replace: true,
      });
    }
  },
  component: ProtectedLayout,
});

function ProtectedLayout() {
  return <Outlet />;
}