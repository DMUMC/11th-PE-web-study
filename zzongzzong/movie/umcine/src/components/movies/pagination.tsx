interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  // TMDB only exposes the first 500 pages.
  const lastPage = Math.min(totalPages, 500);
  if (lastPage <= 1) return null;
  return (
    <nav aria-label="영화 페이지" className="flex items-center justify-center gap-6 mt-6">
      <button type="button" disabled={page <= 1} onClick={() => onPageChange(page - 1)}
        className="cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed">이전</button>
      <span aria-current="page">{page} / {lastPage}</span>
      <button type="button" disabled={page >= lastPage} onClick={() => onPageChange(page + 1)}
        className="cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed">다음</button>
    </nav>
  );
}
