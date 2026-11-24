import { createRootRoute, Link, Outlet } from '@tanstack/react-router';
import Header from '../components/header';
import { MovieProvider } from '../context/movies';
export const Route = createRootRoute({ component: RootLayout, notFoundComponent: () => <main className="p-20"><h1>페이지를 찾을 수 없어요.</h1><Link to="/">영화 목록으로</Link></main> });
function RootLayout() {
  return <MovieProvider><div className="flex min-h-screen flex-col"><Header /><Outlet /><footer className="mt-auto border-t border-[#e9eaed] bg-white"><div className="mx-auto flex min-h-14 max-w-[1440px] items-center justify-end gap-2 px-5 py-4 md:px-20"><img src="/images/logos/tmdb-logo.svg" alt="TMDB" className="w-6" /><small className="text-[11px] text-[#747982]">This product uses the TMDB API but is not endorsed or certified by TMDB.</small></div></footer></div></MovieProvider>;
}
