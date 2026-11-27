"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createContext, useEffect, useState, type ReactNode } from "react";
import { useAuthStore } from "@/src/stores/auth-store";
import { useBookmarkStore } from "@/src/stores/bookmark-store";

export const StorageReadyContext = createContext(false);

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: { queries: { staleTime: 60_000 } },
  }));
  const [storageReady, setStorageReady] = useState(false);

  useEffect(() => {
    let active = true;
    void Promise.allSettled([
      Promise.resolve(useAuthStore.persist?.rehydrate()),
      Promise.resolve(useBookmarkStore.persist?.rehydrate()),
    ]).then(() => {
      if (active) setStorageReady(true);
    });
    return () => { active = false; };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <StorageReadyContext.Provider value={storageReady}>{children}</StorageReadyContext.Provider>
      {process.env.NODE_ENV === "development" && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}
