import FavoriteFeedback from '../../components/favorite-feedback';
import { createFileRoute, Link } from '@tanstack/react-router';
import AccountPrompt from '../../components/account-prompt';
import { useMe } from '../../hooks/use-account';
import { useState } from 'react';
import { useQueries } from '@tanstack/react-query';
import { useFavorites } from '../../hooks/use-favorites';
import { getMovie } from '../../api/tmdb';
import MovieGrid from '../../components/movie-grid';
import Pagination from '../../components/pagination';

export const Route = createFileRoute('/(authenticated)/_auth/mypage/')({ component: ProfilePage });

function ProfilePage() {
  const profile = useMe().data;
  const { bookmarkedIds: ids } = useFavorites();
  const { toggleBookmark: toggle } = useFavorites();
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(ids.length / 10));
  const currentPage = Math.min(page, totalPages);
  const queries = useQueries({ queries: ids.slice((currentPage - 1) * 10, currentPage * 10).map(id => ({ queryKey: ['movies', 'detail', String(id)], queryFn: ({ signal }: { signal: AbortSignal }) => getMovie(String(id), signal) })) });
  if (!profile) return <AccountPrompt />;
  return (
    <main className="mx-auto w-full max-w-[800px] flex-1 px-5 py-10 sm:py-14">
      <div className="mb-7 flex items-center justify-between gap-4">
        <h1 className="text-[28px] font-bold tracking-tight">내 정보</h1>
        <Link to="/mypage/edit" className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-[#dce0e6] bg-white px-4 text-sm font-semibold hover:bg-gray-50">
          <img src="/icons/edit.svg" alt="" className="size-4" />정보 수정
        </Link>
      </div>
      <section className="overflow-hidden rounded-2xl border border-[#e5e7eb] bg-white" aria-label="회원 정보">
        <div className="flex flex-col items-center gap-4 border-b border-[#edf0f3] px-7 py-9 sm:flex-row sm:gap-6 sm:px-10">
          <div className="grid size-20 shrink-0 place-items-center rounded-full bg-[#edf1ff]">
            <img src="/icons/person.svg" alt="" className="size-10" />
          </div>
          <div className="min-w-0 text-center sm:text-left">
            <h2 className="break-words text-2xl font-bold">{profile.nickname}</h2>
            <p className="mt-2 break-words text-sm text-[#687080]">{profile.introduction || '아직 소개가 없습니다.'}</p>
          </div>
        </div>
        <dl className="divide-y divide-[#edf0f3] px-7 sm:px-10">
          <div className="grid gap-2 py-6 sm:grid-cols-[120px_1fr]"><dt className="text-sm text-[#687080]">이메일</dt><dd className="break-all font-medium">{profile.email}</dd></div>
          <div className="grid gap-2 py-6 sm:grid-cols-[120px_1fr]"><dt className="text-sm text-[#687080]">닉네임</dt><dd className="break-words font-medium">{profile.nickname}</dd></div>
          <div className="grid gap-2 py-6 sm:grid-cols-[120px_1fr]"><dt className="text-sm text-[#687080]">소개</dt><dd className="whitespace-pre-wrap break-words leading-7">{profile.introduction || '아직 소개가 없습니다.'}</dd></div>
        </dl>
      </section>
      <p className="mt-5 text-sm leading-6 text-[#687080]">회원 정보는 가입한 계정과 연결되어 있습니다.</p>
      <section className="mt-10" aria-label="내 즐겨찾기"><FavoriteFeedback />
        <h2 className="mb-5 text-xl font-bold">내 즐겨찾기</h2>
        {ids.length === 0 && <p className="text-gray-500">영화 목록에서 북마크를 추가해 보세요.</p>}
        {queries.some(q => q.isPending) && <p>영화를 불러오는 중입니다.</p>}
        {queries.some(q => q.isError) && <p role="alert">일부 영화를 불러오지 못했습니다.</p>}
        <MovieGrid movies={queries.flatMap(q => q.data ? [{ ...q.data, isBookmarked: true }] : [])} onToggleBookmark={toggle} />
        {ids.length > 0 && <Pagination page={currentPage} totalPages={totalPages} onChange={setPage} />}
      </section>
    </main>
  );
}
