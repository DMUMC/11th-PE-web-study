import { Link, useLocation } from "@tanstack/react-router";
import { useLogout } from "../../hooks/use-logout";
import { useMeQuery } from "../../hooks/use-me-query";
import { useAuthStore } from "../../stores/auth-store";
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
  const isMyPageActive = pathname.startsWith("/me");
  const accessToken = useAuthStore((state) => state.accessToken);
  const meQuery = useMeQuery();
  const logout = useLogout();

  function renderAccount() {
    if (!accessToken) {
      return (
        <Link
          to="/login"
          className="flex h-10 items-center rounded-md bg-primary px-4 text-sm font-bold text-white hover:bg-primary-dark"
        >
          로그인
        </Link>
      );
    }
    // enabled가 꺼진 동안에도 isPending은 참이라 실제 첫 요청 중인지는 isLoading으로 본다.
    if (meQuery.isLoading) {
      return <span className="h-10 w-24 animate-pulse rounded-lg bg-gray-200" />;
    }
    return (
      <>
        <Link to="/me" className="text-sm font-bold text-ink">
          {meQuery.data ? `${meQuery.data.nickname}님` : "마이페이지"}
        </Link>
        <button
          type="button"
          onClick={logout}
          className="flex h-10 items-center rounded-md border border-line bg-white px-4 text-sm font-bold text-ink-sub hover:text-ink"
        >
          로그아웃
        </button>
      </>
    );
  }

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
          <Link to="/me" className={navLinkClass(isMyPageActive)}>
            내 정보
          </Link>
        </nav>

        <div className="ml-auto flex items-center gap-[11px]">
          <Link
            to="/search"
            aria-label="검색"
            className="flex size-[42px] items-center justify-center rounded-lg border border-line bg-white text-ink-sub"
          >
            <Icon name="search" />
          </Link>
          {renderAccount()}
        </div>
      </div>
    </header>
  );
}
