"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../stores/auth-store";

export function AuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    let isMounted = true;

    void Promise.resolve(useAuthStore.persist.rehydrate()).then(() => {
      if (!isMounted) return;

      if (useAuthStore.getState().accessToken) {
        setIsAuthorized(true);
      } else {
        router.replace("/login");
      }
    });

    return () => {
      isMounted = false;
    };
  }, [router]);

  return isAuthorized ? children : null;
}
