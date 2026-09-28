import { Link, useLocation } from "@tanstack/react-router";
import { cn } from "../../utils/cn";

export function Header() {
  const location = useLocation();

  const navItems = [
    { to: "/", label: "영화" },
    { to: "/search", label: "검색" },
  ];

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold text-slate-900">
          <img src="/movie-icons/logo.svg" alt="" className="h-8 w-8" />
          <span>UMCine</span>
        </Link>

        <nav className="hidden items-center gap-6 sm:flex" aria-label="메인 네비게이션">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to;

            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "text-sm font-medium transition-colors",
                  isActive ? "text-blue-600 underline underline-offset-4" : "text-slate-600 hover:text-slate-900",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
            aria-label="검색"
          >
            <img src="/movie-icons/search.svg" alt="" className="h-4 w-4" />
          </button>
          <button
            type="button"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            로그인
          </button>
        </div>
      </div>
    </header>
  );
}
