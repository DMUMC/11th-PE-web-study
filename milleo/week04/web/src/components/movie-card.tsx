import { Link } from '@tanstack/react-router';
import type { Movie } from '../types/movie';
import { cn } from '../lib/cn';
interface MovieCardProps { movie: Movie; onToggleBookmark: (id: number) => void }
export default function MovieCard({ movie, onToggleBookmark }: MovieCardProps) {
  return <article className="min-w-0">
    <div className="relative overflow-hidden rounded-[10px] bg-gray-200">
      <Link to="/movies/$movieId" params={{ movieId: String(movie.id) }} aria-label={`${movie.title} 상세 보기`}><img src={movie.posterPath} alt={`${movie.title} 포스터`} className="aspect-[242/274] w-full object-cover" /></Link>
      <button type="button" onClick={() => onToggleBookmark(movie.id)} aria-label={`${movie.title} 북마크`} aria-pressed={movie.isBookmarked} className={cn('absolute right-2.5 top-2.5 grid size-[34px] place-items-center rounded-md border p-1 hover:ring-2 hover:ring-white/60', movie.isBookmarked ? 'border-primary bg-primary' : 'border-white bg-[#191d23]/75')}><img src={movie.isBookmarked ? '/icons/bookmark.svg' : '/icons/bookmark-outline.svg'} alt="" className="size-6 invert" /></button>
    </div>
    <Link to="/movies/$movieId" params={{ movieId: String(movie.id) }}><h2 className="mt-2 mb-0.5 truncate text-sm leading-5 font-bold tracking-tight" title={movie.title}>{movie.title}</h2></Link>
    <time dateTime={movie.releaseDate.replaceAll('.', '-')} className="block text-xs leading-[18px] text-[#8b9099]">{movie.releaseDate}</time>
  </article>;
}
