import { createFileRoute, redirect } from '@tanstack/react-router';

// Preserve bookmarks to the edit URL used in week seven.
export const Route = createFileRoute('/mypage_/edit')({
  beforeLoad: () => { throw redirect({ to: '/profile-edit', replace: true }); },
});
