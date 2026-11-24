import { Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";

import { useAuthStore } from "../../stores/auth-store";

const navBaseClass =
  "text-sm font-bold whitespace-nowrap text-[#17191E] no-underline";

const navActiveClass =
  "underline underline-offset-[6px] decoration-2";

export default function Header() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const accessToken = useAuthStore(
    (state) => state.accessToken,
  );

  const setAccessToken = useAuthStore(
    (state) => state.setAccessToken,
  );

  const isLoggedIn = Boolean(accessToken);

  const handleMyPage = () => {
    if (!isLoggedIn) {
      alert("로그인이 필요한 기능입니다.");
      void navigate({ to: "/login" });
      return;
    }

    void navigate({ to: "/members/me" });
  };

  const handleLogout = () => {
    // 로그인 토큰 제거
    setAccessToken(null);

    // 이전 사용자의 서버 데이터 캐시 제거
    queryClient.clear();

    // 로그아웃 후 메인 페이지 이동
    void navigate({
      to: "/",
      replace: true,
    });
  };

  return (
    <header className="flex h-16 w-full items-center justify-between bg-white px-4 font-[Pretendard,sans-serif] sm:px-8 lg:px-12">
      <div className="flex items-center gap-4 sm:gap-8">
        <Link
          to="/"
          className="flex items-center gap-1.5 no-underline"
        >
          <img
            src="/movie-icons/movie.svg"
            alt="UMCine 로고"
            className="block h-6 w-6 rounded-lg border-2 border-black p-0.5"
          />

          <span className="whitespace-nowrap text-sm font-bold text-[#17191E]">
            UMCine
          </span>
        </Link>

        <nav className="flex items-center gap-4 sm:gap-6">
          <Link
            to="/"
            className={navBaseClass}
            activeProps={{
              className: `${navBaseClass} ${navActiveClass}`,
            }}
            activeOptions={{
              exact: true,
            }}
          >
            영화
          </Link>

          <Link
            to="/search"
            className={navBaseClass}
            activeProps={{
              className: `${navBaseClass} ${navActiveClass}`,
            }}
          >
            검색
          </Link>

          {isLoggedIn ? (
            <Link
              to="/members/me"
              className={navBaseClass}
              activeProps={{
                className: `${navBaseClass} ${navActiveClass}`,
              }}
            >
              내 정보
            </Link>
          ) : (
            <button
              type="button"
              onClick={handleMyPage}
              className={`${navBaseClass} cursor-pointer border-0 bg-transparent p-0`}
            >
              내 정보
            </button>
          )}
        </nav>
      </div>

      <div className="flex items-center gap-2">
        <Link
          to="/search"
          aria-label="검색"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E3E6EB] bg-transparent no-underline"
        >
          <img
            src="/movie-icons/search.svg"
            alt=""
            className="block h-[18px] w-[18px]"
          />
        </Link>

        {isLoggedIn ? (
          <button
            type="button"
            onClick={handleLogout}
            className="h-9 cursor-pointer whitespace-nowrap rounded-lg border-0 bg-[#2563EB] px-4 font-[Pretendard,sans-serif] text-sm font-bold text-white"
          >
            로그아웃
          </button>
        ) : (
          <Link
            to="/login"
            className="flex h-9 items-center justify-center whitespace-nowrap rounded-lg bg-[#2563EB] px-4 font-[Pretendard,sans-serif] text-sm font-bold text-white no-underline"
          >
            로그인
          </Link>
        )}
      </div>
    </header>
  );
}