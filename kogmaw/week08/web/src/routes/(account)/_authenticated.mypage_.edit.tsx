import { createFileRoute } from "@tanstack/react-router";
import { EditProfilePage } from "../../pages/profile/edit-profile-page";

export const Route = createFileRoute("/(account)/_authenticated/mypage_/edit")({
  component: EditProfilePage,
});
