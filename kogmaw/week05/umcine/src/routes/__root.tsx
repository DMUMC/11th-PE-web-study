import { createRootRoute, Outlet } from '@tanstack/react-router';
import { Header } from '../components/layout/header';
import { Footer } from '../components/layout/footer';
import { MovieRequestError } from '../components/movies/request-message';
import { Link } from '@tanstack/react-router';

export const Route = createRootRoute({
  component: RootLayout,
  errorComponent: MovieRequestError,
  notFoundComponent: () => (
    <main className="grid flex-1 place-items-center px-4 py-24 text-center">
      <div><h1 className="text-2xl font-bold">페이지를 찾을 수 없어요.</h1><Link to="/" search={{}} className="mt-5 inline-block text-sm font-semibold text-[#2463cf]">영화 목록으로 돌아가기</Link></div>
    </main>
  ),
});

function RootLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-[#f5f7f9] font-sans text-[#15171a]">
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
}
