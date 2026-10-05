//src/components/movies/pagination.tsx
function Pagination() {
  return (
    <nav
      aria-label="페이지"
      className="mt-10 flex justify-center gap-2"
    >
      <button
        type="button"
        disabled
        aria-label="이전 페이지"
        className="rounded-lg border border-slate-200 px-3 py-2 text-slate-400"
      >
        {"<"}
      </button>

      <button
        type="button"
        aria-current="page"
        className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white"
      >
        1
      </button>

      <button
        type="button"
        disabled
        aria-label="다음 페이지"
        className="rounded-lg border border-slate-200 px-3 py-2 text-slate-400"
      >
        {">"}
      </button>
    </nav>
  );
}

export default Pagination;
