import { createFileRoute } from "@tanstack/react-router";
import { MyPage } from "../pages/my-page/my-page";

export const Route = createFileRoute("/myPage")({ component: MyPage });
