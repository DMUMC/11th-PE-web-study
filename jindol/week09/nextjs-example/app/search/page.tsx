import { Suspense } from "react";
import { SearchPage } from "../../src/page-components/movies/search-page";

export default function SearchRoute() {
  return (
    <Suspense fallback={<main className="py-16 text-center">검색 화면을 불러오는 중이에요...</main>}>
      <SearchPage />
    </Suspense>
  );
}
