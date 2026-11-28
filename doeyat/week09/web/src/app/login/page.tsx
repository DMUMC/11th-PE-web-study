import type { Metadata } from 'next';
import { Suspense } from 'react';
import Screen from '../../features/login';
export const metadata: Metadata = { title: 'UMCine | 로그인' };
export default function Page() { return <Suspense fallback={<main className="p-10">불러오는 중입니다.</main>}><Screen /></Suspense>; }
