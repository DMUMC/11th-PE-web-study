interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

function Pagination({ currentPage, totalPages }: PaginationProps) {
  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav className="pagination" aria-label="페이지 이동">
      <button
        type="button"
        className="pagination-arrow"
        disabled
        aria-label="이전 페이지"
      >
        <img src="/icons/movie-icons/chevron-left.svg" alt="" />
      </button>

      {pageNumbers.map((page) => (
        <button
          key={page}
          type="button"
          className={`pagination-page ${page === currentPage ? "active" : ""}`}
          disabled
          aria-current={page === currentPage ? "page" : undefined}
        >
          {page}
        </button>
      ))}

      <button
        type="button"
        className="pagination-arrow"
        disabled
        aria-label="다음 페이지"
      >
        <img src="/icons/movie-icons/chevron-right.svg" alt="" />
      </button>
    </nav>
  );
}

export default Pagination;