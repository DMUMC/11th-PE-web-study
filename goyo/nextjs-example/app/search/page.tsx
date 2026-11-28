import { Suspense } from "react";
import SearchPage from "@/screens/movies/search-page";

export default function Page() {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <SearchPage />
    </Suspense>
  );
}