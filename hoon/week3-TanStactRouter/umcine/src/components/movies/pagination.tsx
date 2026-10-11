interface PaginationProps {
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

export function Pagination({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
}: PaginationProps) {
  return (
    <nav className="flex items-center justify-center gap-2 py-8">
      <button
        type="button"
        disabled={currentPage <= 1}
        onClick={() => onPageChange?.(currentPage - 1)}
        className="px-3 py-1 text-sm rounded border border-gray-300 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed hover:bg-gray-50"
      >
        이전
      </button>
      <span className="text-sm text-gray-700">
        {currentPage} / {totalPages}
      </span>
      <button
        type="button"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange?.(currentPage + 1)}
        className="px-3 py-1 text-sm rounded border border-gray-300 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed hover:bg-gray-50"
      >
        다음
      </button>
    </nav>
  );
}

export default Pagination;
