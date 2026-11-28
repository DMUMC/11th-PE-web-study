'use client';
import { useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useAuthStore } from '../stores/auth-store';
export default function Providers({ children }: { children: React.ReactNode }) {
  const [client] = useState(() => new QueryClient({ defaultOptions: { queries: { staleTime: 60_000, gcTime: 300_000, retry: 1 } } }));
  useEffect(() => {
    void useAuthStore.persist.rehydrate();
  }, []);
  return <QueryClientProvider client={client}>{children}{process.env.NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={false} />}</QueryClientProvider>;
}
