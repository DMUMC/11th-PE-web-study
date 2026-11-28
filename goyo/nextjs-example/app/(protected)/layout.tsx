"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";

export default function ProtectedLayout({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();
  const accessToken = useAuthStore(
    (state) => state.accessToken,
  );

  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (isReady && !accessToken) {
      router.replace("/login");
    }
  }, [isReady, accessToken, router]);

  if (!isReady || !accessToken) {
    return null;
  }

  return <>{children}</>;
}