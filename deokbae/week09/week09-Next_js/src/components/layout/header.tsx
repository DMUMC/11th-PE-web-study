"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getMe } from "@/api/members/me";
import { useAuthStore } from "@/stores/auth-store";

function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const accessToken = useAuthStore((state) => state.accessToken);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  const meQuery = useQuery({
    queryKey: ["members", "me"],
    queryFn: getMe,
    enabled: Boolean(accessToken),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
  const nickname = meQuery.data?.nickname;

  const handleLogout = () => {
    setAccessToken(null);
    router.push("/");
  };

  return (
    <header className="header">
      <div className="header-left">
        <Link href="/" className="logo">
          <img
            src="/icons/movie-icons/movie.svg"
            alt="UMCine 로고"
            className="logo-icon"
          />
          <span className="logo-text">UMCine</span>
        </Link>
        <nav className="nav-menu">
          <Link
            href="/"
            className={pathname === "/" ? "nav-link active" : "nav-link"}
          >
            영화
          </Link>
          <Link
            href="/search"
            className={
              pathname.startsWith("/search") ? "nav-link active" : "nav-link"
            }
          >
            검색
          </Link>
          <Link href="/mypage" className="nav-link">
            내 정보
          </Link>
        </nav>
      </div>

      <div className="header-right">
        <Link href="/search" className="search-button" aria-label="검색">
          <img
            src="/icons/movie-icons/search.svg"
            alt=""
            className="search-icon"
          />
        </Link>

        {!accessToken ? (
          <Link href="/login" className="login-button">
            로그인
          </Link>
        ) : meQuery.isLoading ? (
          <span className="inline-block h-8 w-24 animate-pulse rounded-lg bg-gray-200" />
        ) : (
          <>
            {nickname && (
              <span className="text-xs font-bold text-slate-700">
                {nickname}님
              </span>
            )}
            <button
              type="button"
              className="login-button"
              onClick={handleLogout}
            >
              로그아웃
            </button>
          </>
        )}
      </div>
    </header>
  );
}

export default Header;