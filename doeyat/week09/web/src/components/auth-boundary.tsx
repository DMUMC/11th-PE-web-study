'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../stores/auth-store';
export default function AuthBoundary({children}:{children:React.ReactNode}) {
 const router=useRouter();
 const token=useAuthStore(s=>s.accessToken);
 const [hydrated,setHydrated]=useState(false);
 useEffect(()=>{ const done=()=>setHydrated(true);const unsubscribe=useAuthStore.persist.onFinishHydration(done);if(useAuthStore.persist.hasHydrated()) done();return unsubscribe; },[]);
 useEffect(()=>{if(hydrated && !token) router.replace('/login');},[hydrated,token,router]);
 if(!hydrated || !token) return <main className="p-10">로그인 상태를 확인하고 있습니다.</main>;
 return children;
}
