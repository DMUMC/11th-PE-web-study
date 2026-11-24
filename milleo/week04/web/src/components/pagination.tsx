export default function Pagination() {
  return <nav aria-label="영화 목록 페이지" className="mt-9 flex justify-center gap-2">
    <button type="button" disabled aria-label="이전 페이지" className="grid size-9 place-items-center rounded-md border border-gray-200 bg-white"><img src="/icons/chevron-left.svg" alt="" className="size-5" /></button>
    <button type="button" aria-current="page" className="size-9 rounded-md border border-primary bg-primary text-sm font-bold text-white">1</button>
    <button type="button" disabled aria-label="다음 페이지" className="grid size-9 place-items-center rounded-md border border-gray-200 bg-white"><img src="/icons/chevron-right.svg" alt="" className="size-5" /></button>
  </nav>;
}
