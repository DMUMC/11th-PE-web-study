"use client";

import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { StorageReadyContext } from "@/app/providers";
import { useAuthStore } from "../../stores/auth-store";

export const LogoutContext = createContext<() => void>(() => {});

export function AuthenticatedLayout({ children, guestOnly = false }: { children: ReactNode; guestOnly?: boolean }) {
  const router = useRouter();
  const storageReady = useContext(StorageReadyContext);
  const accessToken = useAuthStore((state) => state.accessToken);
  const [signingOut, setSigningOut] = useState(false);
  const destination = signingOut || (guestOnly && accessToken) ? "/" : !guestOnly && !accessToken ? "/login" : null;

  useEffect(() => {
    if (!storageReady || !destination) return;
    if (signingOut) useAuthStore.getState().setAccessToken(null);
    router.replace(destination);
  }, [storageReady, destination, router, signingOut]);

  if (!storageReady || destination) {
    return <main role="status" className="p-8 text-center">로그인 상태를 확인하는 중이에요.</main>;
  }

  return <LogoutContext.Provider value={() => setSigningOut(true)}>{children}</LogoutContext.Provider>;
}
