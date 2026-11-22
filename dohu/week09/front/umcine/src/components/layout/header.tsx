import Link from "next/link";
import { Suspense } from "react";
import { Icon } from "../common/icon";
import { HeaderAccount } from "./header-account";
import { HeaderNav, HeaderNavLinks } from "./header-nav";

// 로고와 검색 버튼은 서버에서 그대로 그리고, 주소와 토큰이 필요한 부분만 Client Component로 나눴다.
export function Header() {
  return (
    <header className="border-b border-line bg-white">
      <div className="mx-auto flex h-[89px] max-w-[1440px] items-center px-5 lg:px-20">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-lg border-2 border-ink">
            <Icon name="movie" />
          </span>
          <span className="text-xl font-extrabold tracking-[-0.4px]">UMCine</span>
        </Link>

        {/* 현재 주소는 요청 때만 알 수 있어서, 미리 만드는 화면에는 활성 표시 없는 메뉴를 넣어 둔다. */}
        <Suspense fallback={<HeaderNavLinks pathname={null} />}>
          <HeaderNav />
        </Suspense>

        <div className="ml-auto flex items-center gap-[11px]">
          <Link
            href="/search"
            aria-label="검색"
            className="flex size-[42px] items-center justify-center rounded-lg border border-line bg-white text-ink-sub"
          >
            <Icon name="search" />
          </Link>
          <HeaderAccount />
        </div>
      </div>
    </header>
  );
}
