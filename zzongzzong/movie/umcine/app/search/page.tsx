import { Suspense } from "react";
import { SearchPage } from "../../src/screens/movies/search-page";

export default function SearchRoute() {
  return (
    <Suspense fallback={<p role="status">검색 화면을 준비하고 있어요.</p>}>
      <SearchPage />
    </Suspense>
  );
}
