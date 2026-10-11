import { Link } from '@tanstack/react-router';
export default function Header() {
  return <header className="h-[92px] shrink-0 border-b border-[#e9eaed] bg-white">
    <div className="mx-auto flex h-full max-w-[1440px] items-center justify-between px-5 md:px-20">
      <div className="flex items-center gap-7 md:gap-12">
        <Link to="/" className="flex items-center gap-2.5 text-[22px] font-extrabold tracking-tight" aria-label="UMCine 영화 목록"><span className="grid size-[34px] place-items-center rounded-[9px] border-2"><img src="/icons/movie.svg" alt="" className="size-[26px]" /></span>UMCine</Link>
        <nav aria-label="주 메뉴" className="flex items-center gap-7 text-sm">
          <Link to="/" activeOptions={{ exact: true }} activeProps={{ className: 'font-bold underline underline-offset-4' }}>영화</Link>
          <Link to="/search" search={{ query: '' }} activeProps={{ className: 'font-bold underline underline-offset-4' }}>검색</Link>
          <button type="button" disabled className="hidden sm:block" title="준비 중">내 정보</button>
        </nav>
      </div>
      <div className="flex items-center gap-3"><Link to="/search" search={{ query: '' }} aria-label="영화 검색" className="grid size-[42px] place-items-center rounded-lg border border-gray-200 bg-white"><img src="/icons/search.svg" alt="" className="size-[22px]" /></Link><button type="button" disabled title="준비 중" className="hidden rounded-[7px] bg-primary px-5 py-3 text-sm font-bold text-white sm:block">로그인</button></div>
    </div>
  </header>;
}
