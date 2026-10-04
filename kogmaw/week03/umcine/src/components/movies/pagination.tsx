interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

export function Pagination({ currentPage, totalPages }: PaginationProps) {
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  return (
    <nav className="mt-10 flex items-center justify-center gap-3" aria-label="영화 목록 페이지">
      <button
        className="grid size-[30px] place-items-center rounded-[5px] bg-transparent disabled:cursor-default disabled:opacity-15"
        type="button"
        aria-label="이전 페이지"
        disabled={isFirstPage}
      >
        <img className="size-[22px]" src="/icons/chevron-left.svg" alt="" />
      </button>
      <button
        className="grid size-[30px] place-items-center rounded-[5px] bg-[#1c2027] text-[13px] font-bold text-white"
        type="button"
        aria-current="page"
      >
        {currentPage}
      </button>
      <button
        className="grid size-[30px] place-items-center rounded-[5px] bg-transparent disabled:cursor-default disabled:opacity-15"
        type="button"
        aria-label="다음 페이지"
        disabled={isLastPage}
      >
        <img className="size-[22px]" src="/icons/chevron-right.svg" alt="" />
      </button>
    </nav>
  );
}
