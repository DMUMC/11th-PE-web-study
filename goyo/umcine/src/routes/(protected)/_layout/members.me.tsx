import { createFileRoute } from "@tanstack/react-router";
import { MyPage } from "../../../pages/auth/my-page";

export const Route = createFileRoute(
  "/(protected)/_layout/members/me",
)({
  component: MyPage,
});