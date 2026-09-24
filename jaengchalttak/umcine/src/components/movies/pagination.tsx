export default function Pagination() {
  return (
    <nav className="flex items-center justify-center gap-2 bg-[#f7f8fa] px-5 pb-16 pt-4" aria-label="영화 목록 페이지">
      <button className="flex size-10 items-center justify-center rounded-md text-[#b9bec6]" type="button" aria-label="이전 페이지" disabled>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path d="m12 5-5 5 5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <button className="size-10 rounded-lg bg-[#1d1e20] text-sm font-semibold text-white" type="button" aria-current="page" aria-label="1페이지">
        1
      </button>
      <button className="flex size-10 items-center justify-center rounded-md text-[#b9bec6]" type="button" aria-label="다음 페이지" disabled>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path d="m8 5 5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </nav>
  );
}
