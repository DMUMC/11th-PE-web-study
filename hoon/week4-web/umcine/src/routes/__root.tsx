import { createRootRoute, Outlet } from "@tanstack/react-router";
import { Header } from "../components/layout/header";

export const Route = createRootRoute({
  component: () => (
    <>
      <Header />
      <Outlet />
    </>
  ),
  notFoundComponent: () => (
    <main className="p-10 text-center text-lg font-medium text-gray-600">
      페이지를 찾을 수 없어요.
    </main>
  ),
});
