import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import Header from '@/components/header';
import Providers from './providers';
import './globals.css';

export const metadata: Metadata = {
  title: { default: 'UMCine | 영화 목록', template: 'UMCine | %s' },
  description: 'UMCine 영화 목록과 북마크',
  icons: { icon: '/icons/movie.svg' },
};

export const viewport: Viewport = { themeColor: '#f6f7f9' };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <div className="flex min-h-screen flex-col">
          <Providers>
            <Header />
            {children}
          </Providers>
          <footer className="mt-auto border-t border-[#e9eaed] bg-white">
            <div className="mx-auto flex min-h-14 max-w-[1440px] items-center justify-end gap-2 px-5 py-4 md:px-20">
              <img src="/images/logos/tmdb-logo.svg" alt="TMDB" className="w-6" />
              <small className="text-[11px] text-[#747982]">This product uses the TMDB API but is not endorsed or certified by TMDB.</small>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
