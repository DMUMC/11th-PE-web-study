interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  // TMDB는 최대 500페이지까지 조회할 수 있어요.
  const lastPage = Math.min(totalPages, 500);
  return (
    <nav className="flex items-center justify-center gap-2 bg-[#f7f8fa] px-5 pb-16 pt-4" aria-label="영화 목록 페이지">
      <button className="flex size-10 items-center justify-center rounded-md hover:bg-[#e3e6eb] disabled:text-[#b9bec6]" type="button" aria-label="이전 페이지" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path d="m12 5-5 5 5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <span className="flex h-10 min-w-10 items-center justify-center rounded-lg bg-[#1d1e20] px-3 text-sm font-semibold text-white" aria-current="page" aria-label={`${page}페이지`}>
        {page}
      </span>
      <button className="flex size-10 items-center justify-center rounded-md hover:bg-[#e3e6eb] disabled:text-[#b9bec6]" type="button" aria-label="다음 페이지" disabled={page >= lastPage} onClick={() => onPageChange(page + 1)}>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path d="m8 5 5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </nav>
  );
}
