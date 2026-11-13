import { account } from '../api/account';
import { useProfileStore } from '../stores/profile-store';
import { useState } from 'react';
import { Link } from '@tanstack/react-router';
export default function Header() {
  const profile = useProfileStore((s) => s.profile);
  const [error, setError] = useState('');
  async function logout() { try { await account.logout(); useProfileStore.getState().updateProfile(null); setError(''); } catch(e) { setError((e as Error).message); } }
  return <header className="h-[92px] shrink-0 border-b border-[#e9eaed] bg-white">
    <div className="mx-auto flex h-full max-w-[1440px] items-center justify-between px-5 md:px-20">
      <div className="flex items-center gap-4 md:gap-12">
        <Link to="/" search={{ page: 1 }} className="flex items-center gap-2.5 text-lg sm:text-[22px] font-extrabold tracking-tight" aria-label="UMCine 영화 목록"><span className="grid size-[34px] place-items-center rounded-[9px] border-2"><img src="/icons/movie.svg" alt="" className="size-[26px]" /></span>UMCine</Link>
        <nav aria-label="주 메뉴" className="flex items-center gap-3 text-sm sm:gap-7">
          <Link to="/" search={{ page: 1 }} activeOptions={{ exact: true }} activeProps={{ className: 'font-bold underline underline-offset-4' }}>영화</Link>
          <Link to="/search" search={{ query: '' }} activeProps={{ className: 'font-bold underline underline-offset-4' }}>검색</Link>
          <Link to="/mypage" activeProps={{ className: 'font-bold underline underline-offset-4' }}>내 정보</Link>
        </nav>
      </div>
      <div className="flex items-center gap-3"><Link to="/search" search={{ query: '' }} aria-label="영화 검색" className="hidden size-[42px] sm:grid place-items-center rounded-lg border border-gray-200 bg-white"><img src="/icons/search.svg" alt="" className="size-[22px]" /></Link>{profile ? <button onClick={() => void logout()} className="min-h-11 rounded-lg border px-3 text-sm">로그아웃</button> : <Link to="/login" className="inline-flex min-h-11 items-center rounded-[7px] bg-primary px-4 text-sm font-bold text-white">로그인</Link>}{error && <p role="alert" className="text-xs text-red-700">{error}</p>}</div>
    </div>
  </header>;
}
