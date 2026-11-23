interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const MAX_VISIBLE_PAGES = 5;

function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  // 현재 페이지 주변 5개만 보여줘요 (예: 현재 7이면 5 6 7 8 9)
  const start = Math.max(
    1,
    Math.min(currentPage - 2, totalPages - MAX_VISIBLE_PAGES + 1),
  );
  const end = Math.min(totalPages, start + MAX_VISIBLE_PAGES - 1);
  const pageNumbers = Array.from(
    { length: Math.max(0, end - start + 1) },
    (_, index) => start + index,
  );

  return (
    <nav className="pagination" aria-label="페이지 이동">
      <button
        type="button"
        className="pagination-arrow"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
        aria-label="이전 페이지"
      >
        <img src="/icons/movie-icons/chevron-left.svg" alt="" />
      </button>

      {pageNumbers.map((page) => (
        <button
          key={page}
          type="button"
          className={`pagination-page ${page === currentPage ? "active" : ""}`}
          onClick={() => onPageChange(page)}
          aria-current={page === currentPage ? "page" : undefined}
        >
          {page}
        </button>
      ))}

      <button
        type="button"
        className="pagination-arrow"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        aria-label="다음 페이지"
      >
        <img src="/icons/movie-icons/chevron-right.svg" alt="" />
      </button>
    </nav>
  );
}

export default Pagination;