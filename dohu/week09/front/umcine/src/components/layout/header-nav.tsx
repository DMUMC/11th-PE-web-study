"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/utils/cn";

function navLinkClass(isActive: boolean) {
  return cn(
    "text-sm font-medium text-ink-sub hover:text-ink",
    isActive && "font-bold text-ink underline underline-offset-4",
  );
}

export function HeaderNavLinks({ pathname }: { pathname: string | null }) {
  // 영화 상세도 영화 메뉴에 속하므로 /movies로 시작하면 함께 활성화한다.
  const isMovieActive = pathname === "/" || Boolean(pathname?.startsWith("/movies"));
  const isSearchActive = Boolean(pathname?.startsWith("/search"));
  const isMyPageActive = Boolean(pathname?.startsWith("/me"));

  return (
    <nav className="ml-[43px] flex gap-[30px]" aria-label="주요 메뉴">
      <Link href="/" className={navLinkClass(isMovieActive)}>
        영화
      </Link>
      <Link href="/search" className={navLinkClass(isSearchActive)}>
        검색
      </Link>
      <Link href="/me" className={navLinkClass(isMyPageActive)}>
        내 정보
      </Link>
    </nav>
  );
}

export function HeaderNav() {
  return <HeaderNavLinks pathname={usePathname()} />;
}
