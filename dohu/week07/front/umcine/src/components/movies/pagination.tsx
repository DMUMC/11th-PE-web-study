import { cn } from "../../utils/cn";
import { Icon } from "../common/icon";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const buttonClass =
  "flex size-9 items-center justify-center rounded-md text-sm font-semibold text-ink-sub disabled:cursor-default disabled:text-gray-300";

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav className="mt-10 flex justify-center gap-1" aria-label="페이지 이동">
      <button
        type="button"
        className={buttonClass}
        aria-label="이전 페이지"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        <Icon name="chevron-left" />
      </button>

      {pages.map((page) => (
        <button
          key={page}
          type="button"
          className={cn(
            buttonClass,
            page === currentPage ? "bg-ink text-white" : "hover:bg-line",
          )}
          aria-current={page === currentPage ? "page" : undefined}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}

      <button
        type="button"
        className={buttonClass}
        aria-label="다음 페이지"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        <Icon name="chevron-right" />
      </button>
    </nav>
  );
}
