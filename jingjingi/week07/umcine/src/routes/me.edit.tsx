import { createFileRoute } from "@tanstack/react-router";
import { MemberEditPage } from "../pages/member/member-edit-page";

export const Route = createFileRoute("/me/edit")({ component: MemberEditPage });
