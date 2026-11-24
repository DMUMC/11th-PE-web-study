import { createRootRoute, Outlet } from '@tanstack/react-router';
import { Header } from '../components/layout/header';

export const Route = createRootRoute({
  component: RootLayout,
});

function RootLayout() {
  return (
    <div className="min-h-screen bg-[#f5f7f9] font-sans text-[#15171a]">
      <Header />
      <Outlet />
    </div>
  );
}
