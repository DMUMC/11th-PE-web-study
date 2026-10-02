import { Link } from "@tanstack/react-router";

const navBaseClass =
  "text-sm font-bold whitespace-nowrap text-[#17191E] no-underline";

const navActiveClass =
  "underline underline-offset-[6px] decoration-2";

export default function Header() {
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

          <a
            href="#"
            className={navBaseClass}
          >
            내 정보
          </a>
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

        <button
          type="button"
          className="h-9 cursor-pointer whitespace-nowrap rounded-lg border-0 bg-[#2563EB] px-4 font-[Pretendard,sans-serif] text-sm font-bold text-white"
        >
          로그인
        </button>
      </div>
    </header>
  );
}