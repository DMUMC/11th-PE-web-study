import type { Metadata } from 'next';
import { Suspense } from 'react';
import Screen from '../../../../features/mypage.edit';
export const metadata: Metadata = { title: 'UMCine | 내 정보 수정' };
export default function Page() { return <Suspense fallback={<main className="p-10">불러오는 중입니다.</main>}><Screen /></Suspense>; }
