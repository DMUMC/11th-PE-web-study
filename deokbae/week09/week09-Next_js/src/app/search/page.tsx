import { Suspense } from "react";
import { SearchPage } from "@/views/movies/search-page";

export default function Page() {
  return (
    <Suspense
      fallback={
        <p className="mt-32 text-center text-sm text-slate-500">
          불러오는 중...
        </p>
      }
    >
      <SearchPage />
    </Suspense>
  );
}