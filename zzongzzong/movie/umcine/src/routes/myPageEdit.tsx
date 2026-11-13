import { createFileRoute } from "@tanstack/react-router";
import { MyPageEdit } from "../pages/my-page/my-page-edit";

export const Route = createFileRoute("/myPageEdit")({ component: MyPageEdit });
