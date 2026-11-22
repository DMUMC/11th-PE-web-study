import { useQuery } from '@tanstack/react-query';
import { account } from '../api/account';
import { useSession } from '../stores/session-store';

// Each login has its own cache entry, even if the previous account's request finishes late.
export const profileKey = (revision: number) => ['members', 'me', revision] as const;

export function useProfile() {
  const { token, revision } = useSession();
  return useQuery({
    queryKey: profileKey(revision),
    queryFn: ({ signal }) => account.me(signal),
    enabled: Boolean(token),
    retry: false,
  });
}
