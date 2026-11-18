import { createFileRoute } from "@tanstack/react-router";
import { MyPageEdit } from "@/pages/members/my-page-edit";

export const Route = createFileRoute("/_authenticated/mypage/edit")({ component: MyPageEdit });