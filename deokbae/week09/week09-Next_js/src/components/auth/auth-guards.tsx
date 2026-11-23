"use client";

import { useEffect, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";

// 서버 렌더와 첫 하이드레이션에서는 false, 이후 클라이언트에서는 true
function useIsMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

// 로그인한 사용자만 보여 줘요. 아니면 /login으로 보내요 (기존 _authenticated 가드)
export function RequireAuth({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const mounted = useIsMounted();
  const accessToken = useAuthStore((state) => state.accessToken);

  useEffect(() => {
    if (mounted && !accessToken) router.replace("/login");
  }, [mounted, accessToken, router]);

  if (!mounted || !accessToken) return null;
  return <>{children}</>;
}

// 이미 로그인했으면 /로 보내요 (기존 login 가드)
export function RedirectIfAuthed({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const mounted = useIsMounted();
  const accessToken = useAuthStore((state) => state.accessToken);

  useEffect(() => {
    if (mounted && accessToken) router.replace("/");
  }, [mounted, accessToken, router]);

  if (!mounted || accessToken) return null;
  return <>{children}</>;
}