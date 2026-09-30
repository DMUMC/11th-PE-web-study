interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

export default function Pagination({
  currentPage,
  totalPages,
}: PaginationProps) {
  return (
    <nav className="pagination" aria-label="영화 목록 페이지">
      <button type="button" aria-label="이전 페이지" disabled={currentPage === 1}>
        <img src="/icons/chevron-left.svg" alt="" aria-hidden="true" />
      </button>

      {Array.from({ length: totalPages }, (_, index) => {
        const page = index + 1;

        return (
          <button
            key={page}
            className={page === currentPage ? "active" : ""}
            type="button"
            aria-current={page === currentPage ? "page" : undefined}
          >
            {page}
          </button>
        );
      })}

      <button
        type="button"
        aria-label="다음 페이지"
        disabled={currentPage === totalPages}
      >
        <img src="/icons/chevron-right.svg" alt="" aria-hidden="true" />
      </button>
    </nav>
  );
}
