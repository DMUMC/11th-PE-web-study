import { records } from '../api/movie-records';
import { useMe } from '../hooks/use-account';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';
import { getMovie } from '../api/tmdb';
import { useQuery } from '@tanstack/react-query';
import { queryState } from '../hooks/query-state';
import { useFavorites } from '../hooks/use-favorites';
import RequestFeedback from '../components/request-feedback';
import { cn } from '../lib/cn';
export const Route = createFileRoute('/movies/$movieId')({ component: MovieDetail });
function MovieDetail() {
  const { movieId } = Route.useParams();
  const queryResult = useQuery({ queryKey: ['movies', 'detail', movieId], queryFn: ({ signal }) => getMovie(movieId, signal), enabled: /^[1-9]\d*$/.test(movieId), staleTime: 30_000 });
  const state = queryState(queryResult);
  const retry = () => { void queryResult.refetch(); };
  const { bookmarkedIds: bookmarkedIds } = useFavorites();
  const { toggleBookmark, mutation: favoriteMutation } = useFavorites();
  if (!/^[1-9]\d*$/.test(movieId)) return <main className="p-10"><p>올바르지 않은 영화 ID입니다.</p><Link to="/" search={{ page: 1 }}>영화 목록으로</Link></main>;
  if (state.status !== 'success') return <main className="mx-auto w-full max-w-[1440px] flex-1 px-5 md:px-20"><RequestFeedback message={state.status === 'error' ? state.message : undefined} retry={state.status === 'error' ? retry : undefined} /><Link to="/" search={{ page: 1 }}>영화 목록으로</Link></main>;
  const movie = { ...state.data, isBookmarked: bookmarkedIds.includes(state.data.id) };
  return <main className="flex-1">
    <section className="relative h-[360px] bg-gray-900 text-white"><img src={movie.backdropPath} alt="" className="absolute inset-0 size-full object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/20" /><div className="relative mx-auto flex h-full max-w-[1440px] flex-col justify-between px-5 py-7 md:px-20"><Link to="/" search={{ page: 1 }} className="flex items-center gap-1 self-start text-sm"><span aria-hidden="true">‹</span> 영화 목록</Link><div><h1 className="text-3xl font-bold tracking-tight md:text-[42px]">{movie.title}</h1><p className="mt-2 text-sm">{movie.originalTitle}</p><p className="mt-2 text-sm">{movie.releaseDate} · {movie.genres.join(' · ')} · {movie.runtime}</p></div></div></section>
    <div className="mx-auto grid max-w-[1440px] gap-8 px-5 py-6 md:px-20 lg:grid-cols-[200px_1fr_360px]"><img src={movie.posterPath} alt={`${movie.title} 포스터`} className="w-[200px] rounded-lg shadow-lg" /><section><h2 className="mb-3 text-xl font-bold">{movie.tagline}</h2><p className="text-sm leading-7 text-[#747982]">{movie.overview}</p><button type="button" onClick={() => toggleBookmark(movie.id)} aria-pressed={movie.isBookmarked} className={cn('mt-4 flex items-center gap-2 rounded-md px-4 py-2 text-sm font-bold text-white',movie.isBookmarked ? 'bg-[#17191d]' : 'bg-primary')}><img src="/icons/bookmark-outline.svg" alt="" className="size-4 invert" />{movie.isBookmarked ? '즐겨찾기 해제' : '즐겨찾기'}</button></section>{favoriteMutation.error && <p role="alert">{favoriteMutation.error.message}</p>}<Rating key={movie.id} movieId={movie.id} /></div>
  </main>;
}
function Rating({movieId}: {movieId:number}) {
 const {data:me} = useMe();
 const client = useQueryClient();
 const key = ['ratings',me?.memberId];
 const query = useQuery({queryKey:key,queryFn:()=>records.ratings(me!.memberId),enabled:!!me,retry:false});
 const existing = query.data?.find(r=>r.movieId===movieId);
 const [score,setScore]=useState<number | null>(null);
 const [comment,setComment]=useState<string | null>(null);
 const [saved,setSaved]=useState(false);
 const mutation = useMutation({mutationFn: async (remove:boolean) => { if(remove) { await records.deleteRating(existing!.ratingId); } else { await records.save({movieId,score:score ?? existing?.score ?? 0,comment:comment ?? existing?.comment ?? ''},existing?.ratingId); } }, onSuccess:async()=>{setScore(null);setComment(null);setSaved(true);await client.invalidateQueries({queryKey:key});}});
 if(!me) return <section><Link to="/login">로그인 후 평점을 남겨 주세요.</Link></section>;
 if(query.isLoading) return <p>평점을 불러오는 중입니다.</p>;
 if(query.error) return <p role="alert">{query.error.message}<button onClick={()=>void query.refetch()}>다시 시도</button></p>;
 return <section className="space-y-3"><h2 className="text-xl font-bold">내 평점</h2>
 <label className="block">별점<select aria-label="별점" value={score ?? existing?.score ?? 0} onChange={e=>{setScore(Number(e.target.value));setSaved(false);}}><option value={0}>선택</option>{[1,2,3,4,5].map(n=><option key={n} value={n}>{n}점</option>)}</select></label>
 <textarea aria-label="영화 후기" maxLength={500} value={comment ?? existing?.comment ?? ''} onChange={e=>{setComment(e.target.value);setSaved(false);}} className="w-full rounded border p-3" />
 <button disabled={mutation.isPending || !(score ?? existing?.score)} onClick={()=>mutation.mutate(false)} className="rounded bg-primary p-3 text-white">{mutation.isPending?'처리 중…':existing?'평점 수정':'평점 저장'}</button>
 {existing && <button disabled={mutation.isPending} onClick={()=>mutation.mutate(true)} className="ml-3 rounded border p-3">평점 삭제</button>}
 {mutation.error && <p role="alert">{mutation.error.message}</p>}{saved && <p role="status">변경 사항을 저장했습니다.</p>}</section>;
}
