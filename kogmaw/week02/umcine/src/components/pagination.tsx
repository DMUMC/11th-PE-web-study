interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

export function Pagination({ currentPage, totalPages }: PaginationProps) {
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  return (
    <nav className="pagination" aria-label="영화 목록 페이지">
      <button type="button" aria-label="이전 페이지" disabled={isFirstPage}>
        <img src="/icons/chevron-left.svg" alt="" />
      </button>
      <button className="current-page" type="button" aria-current="page">
        {currentPage}
      </button>
      <button type="button" aria-label="다음 페이지" disabled={isLastPage}>
        <img src="/icons/chevron-right.svg" alt="" />
      </button>
    </nav>
  );
}
