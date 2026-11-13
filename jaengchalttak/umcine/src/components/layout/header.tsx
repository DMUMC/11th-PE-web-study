import { Link, useRouterState } from "@tanstack/react-router";
import { cn } from "../../utils/cn";

const navClass = "relative py-2 text-sm font-semibold text-[#676d76] hover:text-[#1d1e20]";
const activeNavClass = "text-[#1d1e20] after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-[#1d1e20]";

export default function Header() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const isMovieRoute = pathname === "/" || pathname.startsWith("/movies/");
  const isProfileRoute = pathname === "/mypage" || pathname.startsWith("/mypage/");

  return (
    <header className="flex min-h-[91px] items-center justify-between gap-4 border-b border-[#e3e6eb] bg-white px-5 py-4 sm:px-10 lg:px-20">
      <div className="flex min-w-0 items-center gap-5 sm:gap-10">
        <Link className="flex shrink-0 items-center gap-2.5" to="/" aria-label="UMCine 홈">
          <img className="size-8 rounded-lg border-2 border-[#1d1e20] p-[3px]" src="/icons/movie-icons/movie.svg" alt="" />
          <span className="text-xl font-bold">UMCine</span>
        </Link>
        <nav className="flex items-center gap-4 sm:gap-8" aria-label="주 메뉴">
          <Link className={cn(navClass, isMovieRoute && activeNavClass)} to="/" aria-current={isMovieRoute ? "page" : undefined}>
            영화
          </Link>
          <Link className={cn(navClass, pathname === "/search" && activeNavClass)} to="/search" aria-current={pathname === "/search" ? "page" : undefined}>
            검색
          </Link>
          <Link className={cn(navClass, "whitespace-nowrap", isProfileRoute && activeNavClass)} to="/mypage" aria-current={isProfileRoute ? "page" : undefined}>
            내 정보
          </Link>
        </nav>
      </div>
      <div className="flex shrink-0 items-center gap-2.5">
        <Link className="hidden size-[42px] items-center justify-center rounded-lg border border-[#e3e6eb] bg-white hover:bg-[#f7f8fa] sm:flex" to="/search" aria-label="검색">
          <img className="size-5" src="/icons/movie-icons/search.svg" alt="" />
        </Link>
        <Link className="inline-flex h-10 items-center rounded-lg bg-[#2864dc] px-3 text-sm font-semibold text-white hover:bg-[#1f56c7] sm:px-[17px]" to="/login">
          로그인
        </Link>
      </div>
    </header>
  );
}
