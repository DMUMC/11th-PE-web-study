import type { Metadata } from "next";
import { Suspense, type ReactNode } from "react";
import Link from "next/link";
import { Header } from "../src/components/layout/header";
import { ClientProviders } from "../src/providers";
import "./globals.css";
import "../src/page-components/movies/auth/auth-pages.css";

export const metadata: Metadata = {
  title: "UMCine",
  description: "영화를 검색하고 즐겨찾기와 평점을 관리해 보세요.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="flex min-h-full flex-col">
        <ClientProviders>
          <Suspense
            fallback={
              <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/80 backdrop-blur-sm">
                <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
                  <Link href="/" className="text-xl font-bold text-slate-900">
                    UMCine
                  </Link>
                </div>
              </header>
            }
          >
            <Header />
          </Suspense>
          {children}
          <footer className="mt-12 border-t border-slate-200 bg-slate-50">
            <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 sm:flex-row sm:items-center sm:px-6 lg:px-8">
              <a
                href="https://www.themoviedb.org/"
                target="_blank"
                rel="noreferrer"
                aria-label="The Movie Database (TMDB) 웹사이트"
                className="shrink-0"
              >
                <img
                  src="/images/logos/tmdb-logo.svg"
                  alt="TMDB"
                  className="h-auto w-28"
                />
              </a>
              <p className="text-xs leading-5 text-slate-600">
                This product uses the TMDB API but is not endorsed or certified by TMDB.
              </p>
            </div>
          </footer>
        </ClientProviders>
      </body>
    </html>
  );
}
