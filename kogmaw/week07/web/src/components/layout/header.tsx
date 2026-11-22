// src/components/layout/header.tsx

import { Link } from "@tanstack/react-router";

function Header() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-5">
        <Link
          to="/"
          className="text-2xl font-extrabold tracking-tight text-blue-600"
        >
          유엠시네마
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
        </nav>
      </div>
    </header>
  );
}

export default Header;