// src/components/layout/header.tsx

import { Link } from "@tanstack/react-router";
import { useMe } from "../../hooks/use-member";
import { useAuthStore } from "../../stores/auth-store";

function Header() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const meQuery = useMe();

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-5">
        <Link
          to="/"
          aria-label="UMCine 홈"
          className="inline-flex items-center gap-2 text-[17px] font-extrabold tracking-tight text-[#111214]"
        >
          <span aria-hidden="true" className="flex size-6 items-center justify-center rounded-md border border-current">
            <img src="/icons/movie.svg" alt="" className="size-4" />
          </span>
          <span>UMCine</span>
        </Link>

        <nav className="flex flex-wrap gap-6 text-sm font-semibold">
          <Link
            to="/"
            className="hover:text-blue-600"
          >
            영화 목록
          </Link>

          <Link
            to="/search"
            search={{}}
            className="hover:text-blue-600"
          >
            영화 검색
          </Link>

          <Link
            to="/"
            hash="member-api"
            className="hover:text-blue-600"
          >
            회원·평점
          </Link>

          {!accessToken ? (
            <Link to="/login" className="hover:text-blue-600">로그인</Link>
          ) : meQuery.isLoading ? (
            <span role="status" aria-label="내 정보 불러오는 중"
              className="h-5 w-20 animate-pulse rounded bg-slate-200" />
          ) : (
            <Link to="/mypage" className="hover:text-blue-600">마이페이지</Link>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;
