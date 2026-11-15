import { createFileRoute } from "@tanstack/react-router";
import { MemberPage } from "../pages/member/member-page";

export const Route = createFileRoute("/me/")({ component: MemberPage });
