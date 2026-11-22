import { Link, useRouter, type ErrorComponentProps } from '@tanstack/react-router';
import { isHTTPError } from 'ky';
import { MovieNotFoundError } from '../../api/movies';
import { TmdbConfigurationError } from '../../api/tmdb-auth';

interface RequestMessageProps {
  title: string;
  description?: string;
  error?: boolean;
  onRetry?: () => void;
}

export function RequestMessage({ title, description, error = false, onRetry }: RequestMessageProps) {
  return (
    <div
      className="rounded-lg border border-dashed border-[#cbd1d8] bg-white px-6 py-20 text-center"
      role={error ? 'alert' : 'status'}
    >
      <p className="break-words text-lg font-semibold text-[#343940]">{title}</p>
      {description && <p className="mt-3 text-sm leading-6 text-[#737b87]">{description}</p>}
      {onRetry && (
        <button type="button" className="mt-6 rounded-md bg-[#1c2027] px-5 py-2.5 text-sm font-bold text-white hover:bg-black" onClick={onRetry}>
          다시 시도
        </button>
      )}
    </div>
  );
}

export function MovieRequestError({ error, reset }: ErrorComponentProps) {
  const router = useRouter();
  const status = isHTTPError(error) ? error.response.status : undefined;
  const notFound = error instanceof MovieNotFoundError || status === 404;
  let title = '영화 정보를 불러오지 못했어요.';
  let description = '인터넷 연결을 확인한 뒤 다시 시도해 주세요.';

  if (notFound) {
    title = '영화를 찾을 수 없어요.';
    description = '주소가 올바른지 확인하거나 영화 목록에서 다시 선택해 주세요.';
  } else if (error instanceof TmdbConfigurationError || status === 401 || status === 403) {
    title = '영화 서비스에 연결할 수 없어요.';
    description = '서비스 연결 설정을 확인한 뒤 다시 시도해 주세요.';
  } else if (status === 429) {
    description = '요청이 잠시 몰리고 있어요. 잠시 후 다시 시도해 주세요.';
  }

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-16 sm:px-6">
      <RequestMessage
        title={title}
        description={description}
        error
        onRetry={notFound ? undefined : () => { void router.invalidate().then(reset); }}
      />
      <div className="mt-6 text-center">
        <Link to="/" search={{}} className="text-sm font-semibold text-[#2463cf] hover:underline">영화 목록으로 돌아가기</Link>
      </div>
    </main>
  );
}

export function MovieGridSkeleton({ search = false }: { search?: boolean }) {
  return (
    <div role="status" aria-label="영화 정보를 불러오는 중" aria-busy="true">
      <span className="sr-only">영화 정보를 불러오는 중입니다.</span>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5" aria-hidden="true">
        {Array.from({ length: 10 }, (_, index) => (
          <div key={index} className="motion-safe:animate-pulse">
            <div className={`${search ? 'aspect-[2/3]' : 'aspect-[0.9/1]'} rounded-md bg-[#e0e5eb]`} />
            <div className="mt-3 h-3 w-4/5 rounded bg-[#e0e5eb]" />
            <div className="mt-2 h-2 w-1/2 rounded bg-[#e0e5eb]" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function MovieDetailSkeleton() {
  return (
    <main className="w-full flex-1" role="status" aria-label="영화 상세 정보를 불러오는 중" aria-busy="true">
      <span className="sr-only">영화 상세 정보를 불러오는 중입니다.</span>
      <div className="h-[300px] bg-[#e0e5eb] motion-safe:animate-pulse sm:h-[350px] lg:h-[390px]" />
      <div className="mx-auto grid max-w-5xl grid-cols-[120px_1fr] gap-8 px-4 py-10 motion-safe:animate-pulse sm:px-8" aria-hidden="true">
        <div className="aspect-[2/3] rounded-md bg-[#e0e5eb]" />
        <div><div className="mb-6 h-7 w-2/3 rounded bg-[#e0e5eb]" /><div className="mb-3 h-3 w-1/2 rounded bg-[#e0e5eb]" /><div className="mt-10 h-20 rounded bg-[#e0e5eb]" /></div>
      </div>
    </main>
  );
}
