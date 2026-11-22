import { createFileRoute, Navigate, Outlet, redirect } from '@tanstack/react-router';
import AccountPrompt from '../../components/account-prompt';
import { useProfile } from '../../hooks/use-profile';
import { useSession } from '../../stores/session-store';

export const Route = createFileRoute('/(member)/_auth')({
  beforeLoad: () => {
    if (!useSession.getState().token) throw redirect({ to: '/login', replace: true });
  },
  component: MemberLayout,
});

function MemberLayout() {
  const token = useSession(state => state.token);
  const profile = useProfile();
  if (!token) return <Navigate to="/login" replace />;
  if (!profile.data) return <AccountPrompt error={profile.error} retry={() => void profile.refetch()} />;
  return <Outlet />;
}
