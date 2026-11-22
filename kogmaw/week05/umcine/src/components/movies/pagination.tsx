interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const lastPage = Math.min(totalPages, 500);
  if (lastPage < 1) return null;

  return (
    <nav className="mt-10 flex items-center justify-center gap-3" aria-label="영화 목록 페이지">
      <button className="grid size-[30px] place-items-center rounded-[5px] disabled:cursor-default disabled:opacity-20" type="button" aria-label="이전 페이지" disabled={currentPage <= 1} onClick={() => onPageChange(currentPage - 1)}>
        <img className="size-[22px]" src="/icons/chevron-left.svg" alt="" />
      </button>
      <span className="grid min-h-[30px] min-w-[30px] place-items-center rounded-[5px] bg-[#1c2027] px-2 text-[13px] font-bold text-white" aria-current="page" aria-label={`${lastPage}페이지 중 ${currentPage}페이지`}>{currentPage}</span>
      <button className="grid size-[30px] place-items-center rounded-[5px] disabled:cursor-default disabled:opacity-20" type="button" aria-label="다음 페이지" disabled={currentPage >= lastPage} onClick={() => onPageChange(currentPage + 1)}>
        <img className="size-[22px]" src="/icons/chevron-right.svg" alt="" />
      </button>
    </nav>
  );
}
