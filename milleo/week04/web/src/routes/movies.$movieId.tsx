import { useState } from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';
import { useMovies } from '../context/movies';
import { cn } from '../lib/cn';
export const Route = createFileRoute('/movies/$movieId')({ component: MovieDetail });
function MovieDetail() {
  const { movieId } = Route.useParams();
  const { movieList, toggleBookmark } = useMovies();
  const movie = movieList.find(movie => String(movie.id) === movieId);
  if (!movie) return <main className="mx-auto w-full max-w-[1440px] flex-1 px-5 py-20 md:px-20"><h1 className="mb-5 text-2xl font-bold">영화를 찾을 수 없어요.</h1><Link to="/" className="text-primary">영화 목록으로</Link></main>;
  return <main className="flex-1">
    <section className="relative h-[360px] bg-gray-900 text-white"><img src={movie.backdropPath} alt="" className="absolute inset-0 size-full object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/20" /><div className="relative mx-auto flex h-full max-w-[1440px] flex-col justify-between px-5 py-7 md:px-20"><Link to="/" className="flex items-center gap-1 self-start text-sm"><span aria-hidden="true">‹</span> 영화 목록</Link><div><h1 className="text-3xl font-bold tracking-tight md:text-[42px]">{movie.title}</h1><p className="mt-2 text-sm">{movie.originalTitle}</p><p className="mt-2 text-sm">{movie.releaseDate} · {movie.genres.join(' · ')} · {movie.runtime}</p></div></div></section>
    <div className="mx-auto grid max-w-[1440px] gap-8 px-5 py-6 md:px-20 lg:grid-cols-[200px_1fr_360px]"><img src={movie.posterPath} alt={`${movie.title} 포스터`} className="w-[200px] rounded-lg shadow-lg" /><section><h2 className="mb-3 text-xl font-bold">{movie.tagline}</h2><p className="text-sm leading-7 text-[#747982]">{movie.overview}</p><button type="button" onClick={() => toggleBookmark(movie.id)} aria-pressed={movie.isBookmarked} className={cn('mt-4 flex items-center gap-2 rounded-md px-4 py-2 text-sm font-bold text-white',movie.isBookmarked ? 'bg-[#17191d]' : 'bg-primary')}><img src="/icons/bookmark-outline.svg" alt="" className="size-4 invert" />{movie.isBookmarked ? '즐겨찾기 해제' : '즐겨찾기'}</button></section><Rating key={movie.id} /></div>
  </main>;
}
function Rating() {
  const [rating, setRating] = useState(0);
  const [saved, setSaved] = useState(false);
  return <section className="border-gray-200 lg:border-l lg:pl-8"><h2 className="text-xl font-bold">내 평점</h2><p className="mt-1 text-xs text-gray-400">별점을 준 후, 후기를 남겨 주세요.</p><div className="my-3 flex gap-2" role="group" aria-label="별점 선택">{[1,2,3,4,5].map(value => <button key={value} type="button" aria-label={`${value}점`} aria-pressed={rating === value} onClick={() => { setRating(value); setSaved(false); }} className={cn('rounded-md border border-gray-200 bg-white px-2 py-1 text-xl', value <= rating ? 'text-primary' : 'text-gray-400')}>★</button>)}</div><textarea aria-label="영화 후기" placeholder="영화를 보고 느낀 점을 남겨보세요." onChange={() => setSaved(false)} className="h-[100px] w-full resize-none rounded-md border border-gray-200 bg-white p-3 text-sm" /><button type="button" disabled={!rating} onClick={() => setSaved(true)} className="mt-2 w-full rounded-md bg-[#17191d] py-3 text-sm font-bold text-white">평점 저장</button>{saved && <p role="status" className="mt-2 text-xs text-gray-500">현재 화면에 평점을 반영했어요.</p>}</section>;
}
