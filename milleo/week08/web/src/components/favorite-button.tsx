import { useToggleFavorite } from '../hooks/use-member-movies';
import { cn } from '../lib/cn';

interface FavoriteButtonProps {
  memberId: number;
  movieId: number;
  checked: boolean;
  title?: string;
}

export default function FavoriteButton({ memberId, movieId, checked, title }: FavoriteButtonProps) {
  const mutation = useToggleFavorite(memberId, movieId);
  const label = checked ? '즐겨찾기 해제' : '즐겨찾기 추가';
  return (
    <>
      <button
        type="button"
        aria-label={title ? `${title} ${label}` : label}
        aria-pressed={checked}
        disabled={mutation.isPending}
        onClick={() => mutation.mutate(checked)}
        className={cn('inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-3 text-sm font-semibold text-white', checked ? 'bg-primary' : 'bg-[#17191d]')}
      >
        <img src={checked ? '/icons/bookmark.svg' : '/icons/bookmark-outline.svg'} alt="" className="size-5 invert" />
        {!title && label}
      </button>
      {mutation.isError && <p role="alert" className="mt-1 rounded bg-white p-1 text-xs text-red-700">{mutation.error.message}</p>}
    </>
  );
}
