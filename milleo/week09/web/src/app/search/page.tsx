import type { Metadata } from 'next';
import { Suspense } from 'react';
import RequestFeedback from '@/components/request-feedback';
import SearchResults from './search-results';

export const metadata: Metadata = { title: '영화 검색' };

export default function SearchPage() {
  return (
    <main className="mx-auto w-full max-w-[1440px] flex-1 px-5 pt-6 pb-10 md:px-20">
      <h1 className="mb-5 text-[34px] font-bold">영화 검색</h1>
      <Suspense fallback={<RequestFeedback />}>
        <SearchResults />
      </Suspense>
    </main>
  );
}
