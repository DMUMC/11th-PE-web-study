import { cn } from "../../utils/cn";

export function Pagination() {
  return (
    <nav aria-label="영화 목록 페이지" className="mt-12 flex justify-center gap-2">
      {[1, 2, 3].map((page) => (
        <button
          key={page}
          type="button"
          aria-current={page === 1 ? "page" : undefined}
          className={cn(
            "grid size-9 place-items-center rounded-lg text-sm font-semibold transition",
            page === 1
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
