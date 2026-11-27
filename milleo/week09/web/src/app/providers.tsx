'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useEffect, useState, type ReactNode } from 'react';
import { profileKey } from '@/hooks/use-profile';
import { useSession } from '@/stores/session-store';

export default function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: { staleTime: 60_000, gcTime: 300_000, retry: 1 },
    },
  }));

  useEffect(() => {
    const unsubscribe = useSession.subscribe((session, previous) => {
      if (session.revision !== previous.revision) {
        queryClient.removeQueries({ queryKey: profileKey(previous.revision) });
        queryClient.removeQueries({ queryKey: ['member'] });
      }
    });
    useSession.getState().restoreSession();
    return unsubscribe;
  }, [queryClient]);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
