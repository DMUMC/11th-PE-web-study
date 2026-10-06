import { Link } from "@tanstack/react-router";

function BrandMark() {
  return (
    <span className="grid size-7 place-items-center rounded-lg bg-black text-xs font-black text-white">
      U
    </span>
  );
}

function SearchIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="6" />
      <path d="m16 16 4 4" />
    </svg>
  );
}

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center px-5 sm:px-8">
        <Link to="/" className="flex items-center gap-2 font-black tracking-tight text-slate-950">
          <BrandMark />
          <span>UMCine</span>
        </Link>

        <nav aria-label="주요 메뉴" className="ml-10 hidden items-center gap-7 text-sm font-semibold text-slate-500 sm:flex">
          <Link to="/" activeProps={{ className: "text-slate-950" }}>
            영화
          </Link>
          <Link to="/search" activeProps={{ className: "text-slate-950" }}>
            검색
          </Link>
          <span className="cursor-not-allowed text-slate-300">내 정보</span>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <Link
            to="/search"
            aria-label="영화 검색"
            className="grid size-9 place-items-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-50"
          >
            <SearchIcon />
          </Link>
          <button
            type="button"
            className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-brand-500"
          >
            로그인
          </button>
        </div>
      </div>
    </header>
  );
}
