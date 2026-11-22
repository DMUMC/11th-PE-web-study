import { Suspense } from "react";
import { SearchPage } from "@/src/screens/movies/search-page";

export const metadata = { title: "영화 검색 | UMCine" };

export default function Page({ searchParams }: PageProps<"/search">) {
  return (
    <Suspense fallback={<main role="status" className="p-8">검색 화면을 불러오는 중이에요.</main>}>
      <SearchScreen searchParams={searchParams} />
    </Suspense>
  );
}

async function SearchScreen({ searchParams }: Pick<PageProps<"/search">, "searchParams">) {
  const { query } = await searchParams;
  return <SearchPage query={typeof query === "string" ? query : undefined} />;
}
