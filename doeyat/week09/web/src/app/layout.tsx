import type { Metadata } from 'next';
import Header from '../components/header';
import Providers from './providers';
import '../styles.css';
export const metadata: Metadata = { title: 'UMCine', description: 'doeyat의 영화와 회원 서비스' };
export default function RootLayout({ children }: { children: React.ReactNode }) { return <html lang="ko"><body><div className="flex min-h-screen flex-col"><Providers><Header />{children}</Providers><footer className="mt-auto border-t border-[#e9eaed] bg-white"><div className="mx-auto flex min-h-14 max-w-[1440px] items-center justify-end gap-2 px-5 py-4 md:px-20"><img src="/images/logos/tmdb-logo.svg" alt="TMDB" className="w-6" /><small className="text-[11px] text-[#747982]">This product uses the TMDB API but is not endorsed or certified by TMDB.</small></div></footer></div></body></html>; }
