import { createFileRoute } from "@tanstack/react-router";
import { MyInfoPage } from "../../pages/my/my-info-page";

export const Route = createFileRoute("/my/")({ component: MyInfoPage });
