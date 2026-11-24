import { createFileRoute } from "@tanstack/react-router";
import { ApiDemoPage } from "../pages/api-demo-page";

export const Route = createFileRoute("/api-demo")({
  component: ApiDemoPage,
});
