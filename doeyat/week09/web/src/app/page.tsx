import type { Metadata } from 'next';
import { Suspense } from 'react';
import Screen from '../features/index';
export const metadata: Metadata = { title: 'UMCine | 영화 목록' };
export default function Page() { return <Suspense fallback={<main className="p-10">불러오는 중입니다.</main>}><Screen /></Suspense>; }
