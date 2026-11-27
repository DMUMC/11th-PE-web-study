"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const ONE_MINUTE = 60 * 1000;

export function Providers({ children }: { children: React.ReactNode }) {
  // 컴포넌트 안에서 한 번만 만들어요 (서버에서 요청끼리 캐시가 섞이지 않게)
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: { queries: { staleTime: ONE_MINUTE } },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}