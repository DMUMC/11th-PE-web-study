"use client";

import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { StatusMessage } from "@/components/common/status-message";
import { useAuthStore } from "@/stores/auth-store";

// 토큰은 localStorage에 있어서 서버에서는 확인할 수 없다. 브라우저에서 읽은 뒤에 막는다.
export function ProtectedGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const accessToken = useAuthStore((state) => state.accessToken);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);

  useEffect(() => {
    // 처음 들어올 때뿐 아니라 보는 중에 401이나 로그아웃으로 토큰이 지워져도 로그인으로 보낸다.
    if (hasHydrated && !accessToken) {
      router.replace("/login");
    }
  }, [hasHydrated, accessToken, router]);

  // 페이지 내용은 토큰과 내 정보에 따라 달라서 서버에서 미리 그리지 않고 확인이 끝난 뒤에만 그린다.
  if (!hasHydrated || !accessToken) {
    return (
      <main className="flex-1 px-5">
        <StatusMessage>로그인 상태를 확인하는 중이에요.</StatusMessage>
      </main>
    );
  }

  return <>{children}</>;
}
