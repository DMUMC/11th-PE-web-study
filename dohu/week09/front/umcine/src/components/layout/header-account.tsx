"use client";

import Link from "next/link";
import { useLogout } from "@/hooks/use-logout";
import { useMeQuery } from "@/hooks/use-me-query";
import { useAuthStore } from "@/stores/auth-store";

export function HeaderAccount() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const meQuery = useMeQuery();
  const logout = useLogout();

  // 서버 HTML에는 토큰이 없으니 localStorage를 읽기 전에는 자리만 잡아 둔다.
  // 토큰이 있으면 내 정보를 처음 받는 동안에도 같은 자리를 보여 준다.
  if (!hasHydrated || (accessToken && meQuery.isLoading)) {
    return <span className="h-10 w-24 animate-pulse rounded-lg bg-gray-200" />;
  }

  if (!accessToken) {
    return (
      <Link
        href="/login"
        className="flex h-10 items-center rounded-md bg-primary px-4 text-sm font-bold text-white hover:bg-primary-dark"
      >
        로그인
      </Link>
    );
  }

  return (
    <>
      <Link href="/me" className="text-sm font-bold text-ink">
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
