import { cn } from "../../utils/cn";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const firstPage = Math.max(1, Math.min(currentPage - 2, totalPages - 4));
  const pages = Array.from(
    { length: Math.min(5, totalPages) },
    (_, index) => firstPage + index,
  );

  return (
    <nav aria-label="영화 목록 페이지" className="mt-12 flex justify-center gap-2">
      {pages.map((page) => (
        <button
          key={page}
          type="button"
          aria-current={page === currentPage ? "page" : undefined}
          onClick={() => onPageChange(page)}
          className={cn(
            "grid size-9 place-items-center rounded-lg text-sm font-semibold transition",
            page === currentPage
              ? "bg-slate-950 text-white"
              : "bg-white text-slate-500 hover:bg-slate-100",
          )}
        >
          {page}
        </button>
      ))}
    </nav>
  );
}
