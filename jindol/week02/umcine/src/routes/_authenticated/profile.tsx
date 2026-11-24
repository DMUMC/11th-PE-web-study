import { createFileRoute } from "@tanstack/react-router";
import { ProfilePage } from "../../pages/movies/auth/profile-page";

export const Route = createFileRoute("/_authenticated/profile")({
  component: ProfilePage,
});
