'use client';
import { useFavorites } from '../hooks/use-favorites';
export default function FavoriteFeedback() { const q=useFavorites();return q.isLoading ? <p>??평점을 불러오는 중입니다.</p> : q.error ? <p role="alert">{q.error.message}<button onClick={()=>void q.refetch()}>다시 시도</button></p> : null; }
