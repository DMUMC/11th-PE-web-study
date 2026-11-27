'use client';

import { useRouter } from 'next/navigation';
import { useEffect, type ReactNode } from 'react';
import AccountPrompt from '@/components/account-prompt';
import { useProfile } from '@/hooks/use-profile';
import { useSession } from '@/stores/session-store';

export default function MemberGate({ children }: { children: ReactNode }) {
  const router = useRouter();
  const ready = useSession(state => state.ready);
  const token = useSession(state => state.token);
  const profile = useProfile();

  useEffect(() => {
    if (ready && !token) router.replace('/login');
  }, [ready, router, token]);

  if (!ready || !token || !profile.data) {
    return <AccountPrompt error={profile.error} retry={() => void profile.refetch()} />;
  }
  return children;
}
