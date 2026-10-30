import { createRootRoute, Outlet } from "@tanstack/react-router";
import { Footer } from "../components/layout/footer";
import { Header } from "../components/layout/header";

export const Route = createRootRoute({
  component: () => (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  ),
  notFoundComponent: () => (
    <main className="grid min-h-[calc(100vh-8rem)] place-items-center bg-slate-50 px-6 text-center">
      <div>
        <p className="text-6xl font-black text-slate-200">404</p>
        <h1 className="mt-4 text-2xl font-black text-slate-950">페이지를 찾을 수 없어요.</h1>
      </div>
    </main>
  ),
});
