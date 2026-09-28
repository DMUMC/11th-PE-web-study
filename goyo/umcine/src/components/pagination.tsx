
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <nav className="pagination" aria-label="페이지 이동">
      <button
        type="button"
        className="pagination-prev"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="이전 페이지"
      >
        <img
          src="/images/movie-icons/chevron-left.svg"
          alt=""
        />
      </button>

      <div className="pagination-pages">
        {Array.from({ length: totalPages }, (_, index) => {
          const page = index + 1;

          return (
            <button
              key={page}
              type="button"
              className={
                currentPage === page
                  ? "pagination-page active"
                  : "pagination-page"
              }
              onClick={() => onPageChange(page)}
              aria-current={
                currentPage === page ? "page" : undefined
              }
            >
              {page}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        className="pagination-next"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="다음 페이지"
      >
        <img
          src="/movie-icons/chevron-right.svg"
          alt=""
        />
      </button>
    </nav>
  );
}
