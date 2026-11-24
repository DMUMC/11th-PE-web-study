import { Link, useRouterState } from '@tanstack/react-router';
import { cn } from '../../utils/cn';

const navLinkClass =
  'relative inline-flex h-full items-center text-sm font-medium text-[#565b64] transition-colors hover:text-[#15171a]';

export function Header() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });
  const isMoviesRoute = pathname === '/' || pathname.startsWith('/movies/');

  return (
    <header className="h-[72px] border-b border-[#e8eaed] bg-white">
      <div className="mx-auto flex h-full w-full max-w-[1440px] items-center px-4 sm:px-6 lg:px-16">
        <Link
          className="inline-flex items-center gap-2 text-[17px] font-extrabold tracking-[-0.4px] text-[#111214] no-underline"
          to="/"
          aria-label="UMCine 홈"
        >
          <img className="size-[26px]" src="/icons/movie.svg" alt="" />
          <span>UMCine</span>
        </Link>

        <nav className="ml-[38px] hidden h-full items-center gap-[34px] sm:flex" aria-label="주요 메뉴">
          <Link
            className={cn(
              navLinkClass,
              isMoviesRoute &&
                "font-bold text-[#15171a] after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-[#2563d9] after:content-['']",
            )}
            to="/"
          >
            영화
          </Link>
          <a className={navLinkClass} href="#reviews">
            리뷰
          </a>
          <a className={navLinkClass} href="#my-info">
            내 정보
          </a>
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <Link
            className={cn(
              'grid size-9 place-items-center rounded-[5px] border border-[#e6e8eb] bg-white transition-colors hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2463cf]',
              pathname === '/search' && 'border-[#2463cf] bg-blue-50',
            )}
            to="/search"
            search={{}}
            aria-label="영화 검색"
          >
            <img className="size-[19px]" src="/icons/search.svg" alt="" />
          </Link>
          <button
            className="hidden h-9 rounded-[5px] bg-[#2463cf] px-[17px] text-[13px] font-bold text-white sm:block"
            type="button"
          >
            로그인
          </button>
        </div>
      </div>
    </header>
  );
}
