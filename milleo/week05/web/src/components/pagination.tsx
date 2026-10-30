export default function Pagination({ page, totalPages, onChange }: { page: number; totalPages: number; onChange: (page: number) => void }) {
  return <nav aria-label="영화 목록 페이지" className="mt-9 flex items-center justify-center gap-3">
    <button type="button" disabled={page <= 1} onClick={() => onChange(page - 1)} className="min-h-11 rounded-md border border-gray-200 bg-white px-4 disabled:opacity-40">이전</button>
    <span aria-current="page" className="text-sm">{page} / {Math.max(totalPages, 1)}</span>
    <button type="button" disabled={page >= totalPages} onClick={() => onChange(page + 1)} className="min-h-11 rounded-md border border-gray-200 bg-white px-4 disabled:opacity-40">다음</button>
  </nav>;
}
