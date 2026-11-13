import { createRootRoute, Outlet } from "@tanstack/react-router";
import { Header } from "../components/layout/header";

export const Route = createRootRoute({
  component: () => (
    <>
      <Header />
      <Outlet />
      <footer className="mt-12 border-t border-slate-200 bg-slate-50">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 sm:flex-row sm:items-center sm:px-6 lg:px-8">
          <a
            href="https://www.themoviedb.org/"
            target="_blank"
            rel="noreferrer"
            aria-label="The Movie Database (TMDB) 웹사이트"
            className="shrink-0"
          >
            <img src="/images/logos/tmdb-logo.svg" alt="TMDB" className="h-auto w-28" />
          </a>
          <p className="text-xs leading-5 text-slate-600">
            This product uses the TMDB API but is not endorsed or certified by TMDB.
          </p>
        </div>
      </footer>
    </>
  ),
  notFoundComponent: () => <main>페이지를 찾을 수 없어요.</main>,
});