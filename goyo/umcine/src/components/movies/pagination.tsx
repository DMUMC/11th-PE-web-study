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
    <nav
      className="flex items-center justify-center gap-2"
      aria-label="페이지 이동"
    >
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="이전 페이지"
        className="
          flex h-9 w-9 items-center justify-center
          rounded-lg border border-[#E3E6EB]
          bg-white
          disabled:cursor-not-allowed disabled:opacity-40
        "
      >
        <img
          src="/movie-icons/chevron-left.svg"
          alt=""
          className="h-4 w-4"
        />
      </button>

      <div className="flex items-center gap-1">
        {Array.from({ length: totalPages }, (_, index) => {
          const page = index + 1;

          return (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange(page)}
              aria-current={currentPage === page ? "page" : undefined}
              className={`
                flex h-9 min-w-9 items-center justify-center
                rounded-lg px-2
                text-sm font-medium
                ${
                  currentPage === page
                    ? "bg-[#2563EB] text-white"
                    : "bg-white text-[#17191E] hover:bg-[#EDEFF2]"
                }
              `}
            >
              {page}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="다음 페이지"
        className="
          flex h-9 w-9 items-center justify-center
          rounded-lg border border-[#E3E6EB]
          bg-white
          disabled:cursor-not-allowed disabled:opacity-40
        "
      >
        <img
          src="/movie-icons/chevron-right.svg"
          alt=""
          className="h-4 w-4"
        />
      </button>
    </nav>
  );
}