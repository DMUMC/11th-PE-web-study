import { Link, useLocation } from "@tanstack/react-router";
import { cn } from "../../utils/cn";
import { Icon } from "../common/icon";

function navLinkClass(isActive: boolean) {
  return cn(
    "text-sm font-medium text-ink-sub hover:text-ink",
    isActive && "font-bold text-ink underline underline-offset-4",
  );
}

export function Header() {
  const pathname = useLocation({ select: (location) => location.pathname });
  // 영화 상세도 영화 메뉴에 속하므로 /movies로 시작하면 함께 활성화한다.
  const isMovieActive = pathname === "/" || pathname.startsWith("/movies");
  const isSearchActive = pathname.startsWith("/search");

  return (
    <header className="border-b border-line bg-white">
      <div className="mx-auto flex h-[89px] max-w-[1440px] items-center px-5 lg:px-20">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-lg border-2 border-ink">
            <Icon name="movie" />
          </span>
          <span className="text-xl font-extrabold tracking-[-0.4px]">UMCine</span>
        </Link>

        <nav className="ml-[43px] flex gap-[30px]" aria-label="주요 메뉴">
          <Link to="/" className={navLinkClass(isMovieActive)}>
            영화
          </Link>
          <Link to="/search" className={navLinkClass(isSearchActive)}>
            검색
          </Link>
          <span className="text-sm font-medium text-ink-sub">내 정보</span>
        </nav>

        <div className="ml-auto flex items-center gap-[11px]">
          <Link
            to="/search"
            aria-label="검색"
            className="flex size-[42px] items-center justify-center rounded-lg border border-line bg-white text-ink-sub"
          >
            <Icon name="search" />
          </Link>
          <button
            type="button"
            className="h-10 rounded-md bg-primary px-4 text-sm font-bold text-white hover:bg-primary-dark"
          >
            로그인
          </button>
        </div>
      </div>
    </header>
  );
}
