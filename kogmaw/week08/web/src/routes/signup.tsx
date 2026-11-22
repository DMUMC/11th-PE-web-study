import { createFileRoute, redirect } from "@tanstack/react-router";
import { SignupPage } from "../pages/auth/signup-page";
import { useAuthStore } from "../stores/auth-store";

export const Route = createFileRoute("/signup")({
  beforeLoad: () => {
    if (useAuthStore.getState().accessToken) throw redirect({ to: "/" });
  },
  component: SignupPage,
});
