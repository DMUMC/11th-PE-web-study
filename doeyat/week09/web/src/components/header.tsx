'use client';

import { usePathname } from 'next/navigation';
import { account } from '../api/account';
import { useMe } from '../hooks/use-account';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import Link from 'next/link';
export default function Header() {
  const pathname = usePathname();
  const { data: profile, isLoading } = useMe();
  const client = useQueryClient();
  const [error, setError] = useState('');
  async function logout() { try { await account.logout(); client.clear(); setError(''); } catch(e) { setError((e as Error).message); } }
  return <header className="h-[92px] shrink-0 border-b border-[#e9eaed] bg-white">
    <div className="mx-auto flex h-full max-w-[1440px] items-center justify-between px-5 md:px-20">
      <div className="flex items-center gap-4 md:gap-12">
        <Link href="/" className="flex items-center gap-2.5 text-lg sm:text-[22px] font-extrabold tracking-tight" aria-label="UMCine 영화 목록"><span className="grid size-[34px] place-items-center rounded-[9px] border-2"><img src="/icons/movie.svg" alt="" className="size-[26px]" /></span>UMCine</Link>
        <nav aria-label="주 메뉴" className="flex items-center gap-3 text-sm sm:gap-7">
          <Link href="/" aria-current={pathname === '/' || pathname.startsWith('/movies/') ? "page" : undefined} className={pathname === '/' || pathname.startsWith('/movies/') ? "font-bold underline underline-offset-4" : undefined}>영화</Link>
          <Link href="/search" aria-current={pathname.startsWith('/search') ? "page" : undefined} className={pathname.startsWith('/search') ? "font-bold underline underline-offset-4" : undefined}>검색</Link>
          <Link href="/mypage" aria-current={pathname.startsWith('/mypage') ? "page" : undefined} className={pathname.startsWith('/mypage') ? "font-bold underline underline-offset-4" : undefined}>내 정보</Link>
        </nav>
      </div>
      <div className="flex items-center gap-3"><Link href="/search" aria-label="영화 검색" className="hidden size-[42px] sm:grid place-items-center rounded-lg border border-gray-200 bg-white"><img src="/icons/search.svg" alt="" className="size-[22px]" /></Link>{isLoading ? <span aria-label="회원 정보 로딩 중" className="h-10 w-24 animate-pulse rounded bg-gray-200" /> : profile ? <button onClick={() => void logout()} className="min-h-11 rounded-lg border px-3 text-sm">로그아웃</button> : <Link href="/login" className="inline-flex min-h-11 items-center rounded-[7px] bg-primary px-4 text-sm font-bold text-white">로그인</Link>}{error && <p role="alert" className="text-xs text-red-700">{error}</p>}</div>
    </div>
  </header>;
}
