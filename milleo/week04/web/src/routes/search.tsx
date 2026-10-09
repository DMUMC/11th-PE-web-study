import { useEffect, useState } from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';
import { useMovies } from '../context/movies';
export const Route = createFileRoute('/search')({
  validateSearch: (search: Record<string, unknown>): { query: string } => ({ query: typeof search.query === 'string' ? search.query : '' }),
  component: SearchPage,
});
function SearchPage() {
  const { query } = Route.useSearch();
  const navigate = Route.useNavigate();
  const [input, setInput] = useState(query);
  const { movieList } = useMovies();
  useEffect(() => { setInput(query); }, [query]);
  const keyword = query.trim().toLocaleLowerCase();
  const results = keyword ? movieList.filter(movie => `${movie.title} ${movie.originalTitle}`.toLocaleLowerCase().includes(keyword)) : [];
  return <main className="mx-auto w-full max-w-[1440px] flex-1 px-5 pt-6 pb-10 md:px-20">
    <h1 className="mb-5 text-[34px] font-bold">영화 검색</h1>
    <form className="mb-8 flex gap-2" onSubmit={event => { event.preventDefault(); void navigate({ search: { query: input.trim() } }); }}><label className="sr-only" htmlFor="movie-query">검색어</label><input id="movie-query" value={input} onChange={event => setInput(event.target.value)} placeholder="영화 제목을 입력해 주세요" className="min-w-0 flex-1 rounded-md border border-gray-200 bg-white px-4 py-3 text-sm" /><button type="submit" className="rounded-md bg-[#17191d] px-5 py-3 text-sm font-bold text-white">검색</button></form>
    {!keyword ? <p className="py-20 text-center text-gray-500">검색어를 입력해 주세요.</p> : <><p className="mb-5 text-sm text-gray-600">“{query}” 검색 결과 {results.length}개</p>{results.length === 0 ? <p className="py-20 text-center text-gray-500">검색 결과가 없어요.</p> : <div className="grid gap-x-8 gap-y-6 md:grid-cols-2">{results.map(movie => <Link key={movie.id} to="/movies/$movieId" params={{ movieId: String(movie.id) }} className="flex gap-4 rounded-md p-2 transition-colors hover:bg-white"><img src={movie.posterPath} alt={`${movie.title} 포스터`} className="w-[100px] shrink-0 rounded-md object-cover" /><div><h2 className="font-bold">{movie.title}</h2><p className="mt-1 text-xs text-gray-500">
  {movie.isBookmarked ? '🔖 북마크됨' : '북마크 안 됨'}
</p><p className="mt-1 text-xs text-gray-500">{movie.originalTitle}</p><time className="mt-2 block text-xs text-gray-500">{movie.releaseDate}</time><p className="mt-3 text-sm leading-6 text-gray-600">{movie.overview}</p></div></Link>)}</div>}</>}
  </main>;
}
