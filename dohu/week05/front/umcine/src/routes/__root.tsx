import { createRootRoute, Outlet } from "@tanstack/react-router";
import { Footer } from "../components/layout/footer";
import { Header } from "../components/layout/header";

export const Route = createRootRoute({
  component: () => (
    <div className="flex min-h-svh flex-col">
      <Header />
      <Outlet />
      <Footer />
    </div>
  ),
  notFoundComponent: () => (
    <main className="flex-1 px-5 py-20 text-center text-ink-sub">
      페이지를 찾을 수 없어요.
    </main>
  ),
});
