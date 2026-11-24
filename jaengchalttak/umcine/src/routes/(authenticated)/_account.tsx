import { createFileRoute, redirect } from "@tanstack/react-router";
import { AuthenticatedLayout } from "../../components/account/authenticated-layout";
import { useAuthStore } from "../../stores/auth-store";

export const Route = createFileRoute("/(authenticated)/_account")({
  beforeLoad: () => {
    if (!useAuthStore.getState().accessToken) throw redirect({ to: "/login", replace: true });
  },
  component: AuthenticatedLayout,
});
