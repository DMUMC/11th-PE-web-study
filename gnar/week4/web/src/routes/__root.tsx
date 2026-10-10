import {
  createRootRoute,
  Link,
  Outlet,
} from "@tanstack/react-router";

import Header from "../components/layout/header";

export const Route = createRootRoute({
  component: RootLayout,
  notFoundComponent: NotFoundPage,
});

function RootLayout() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Header />
      <Outlet />
    </div>
  );
}

function NotFoundPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="mb-4 text-2xl font-bold">
        페이지를 찾을 수 없어요.
      </h1>
      <Link to="/" className="text-blue-600 hover:underline">
        영화 목록으로 돌아가기
      </Link>
    </main>
  );
}