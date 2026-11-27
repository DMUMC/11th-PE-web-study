import { useState } from 'react';
import { type Rating } from '../api/member-movies';
import { useChangeRating, useRatings } from '../hooks/use-member-movies';
import { cn } from '../lib/cn';
import QueryError from './query-error';

export default function MovieRating({ memberId, movieId }: { memberId: number; movieId: number }) {
  const ratings = useRatings(memberId);
  const mutation = useChangeRating(memberId, movieId);
  const saved = ratings.data?.find(item => item.movieId === movieId);
  return (
    <section aria-label="내 평점" className="border-gray-200 lg:border-l lg:pl-8">
      <h2 className="text-xl font-bold">내 평점</h2>
      {ratings.isPending && <p role="status" className="mt-3 text-sm">평점을 불러오는 중이에요.</p>}
      {ratings.isError && <QueryError error={ratings.error} retry={() => void ratings.refetch()} />}
      {ratings.isSuccess && (
        <RatingEditor key={saved ? `${saved.ratingId}:${saved.updatedAt}` : 'new'}
          saved={saved} pending={mutation.isPending}
          onSave={(score, comment) => {
            const input = { score, comment };
            if (saved) mutation.mutate({ type: 'edit', ratingId: saved.ratingId, input });
            else mutation.mutate({ type: 'create', input });
          }}
          onRemove={() => { if (saved) mutation.mutate({ type: 'remove', ratingId: saved.ratingId }); }}
        />
      )}
      {mutation.isError && <p role="alert" className="mt-2 text-sm text-red-700">{mutation.error.message}</p>}
      {mutation.isSuccess && <p role="status" className="mt-2 text-sm text-gray-600">{mutation.variables.type === 'remove' ? '평점을 삭제했어요.' : '평점을 저장했어요.'}</p>}
    </section>
  );
}

interface RatingEditorProps {
  saved?: Rating;
  pending: boolean;
  onSave: (score: number, comment: string) => void;
  onRemove: () => void;
}

function RatingEditor({ saved, pending, onSave, onRemove }: RatingEditorProps) {
  const [score, setScore] = useState(saved?.score ?? 0);
  const [comment, setComment] = useState(saved?.comment ?? '');
  return (
    <form onSubmit={event => { event.preventDefault(); if (score && !pending) onSave(score, comment.trim()); }}>
      <fieldset disabled={pending}>
        <legend className="sr-only">별점 선택</legend>
        <div className="my-3 flex gap-1">
          {[1, 2, 3, 4, 5].map(value => (
            <button key={value} type="button" aria-label={`${value}점`} aria-pressed={score === value}
              onClick={() => setScore(value)}
              className={cn('size-11 rounded-md border border-gray-200 bg-white text-xl', value <= score ? 'text-primary' : 'text-gray-400')}>
              ★
            </button>
          ))}
        </div>
        <label className="mb-1 block text-sm font-semibold" htmlFor="movie-comment">영화 후기</label>
        <textarea id="movie-comment" value={comment} onChange={event => setComment(event.target.value)}
          maxLength={500} rows={3} placeholder="영화를 보고 느낀 점을 남겨보세요."
          className="w-full rounded-md border border-gray-200 bg-white p-3 text-sm" />
        <div className="mt-2 flex gap-2">
          <button type="submit" disabled={!score || pending} className="min-h-11 flex-1 rounded-md bg-[#17191d] px-3 text-sm font-bold text-white">{saved ? '평점 수정' : '평점 등록'}</button>
          {saved && <button type="button" onClick={onRemove} className="min-h-11 rounded-md border border-gray-300 bg-white px-3 text-sm">평점 삭제</button>}
        </div>
      </fieldset>
    </form>
  );
}
