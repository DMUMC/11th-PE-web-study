import { useState } from 'react';
import { cn } from '../../utils/cn';

interface MovieImageProps {
  path: string | null;
  alt: string;
  className?: string;
  backdrop?: boolean;
  eager?: boolean;
}

export function MovieImage({ path, alt, className, backdrop = false, eager = false }: MovieImageProps) {
  const [failedPath, setFailedPath] = useState<string | null>(null);
  const missing = !path || failedPath === path;

  if (missing) {
    return (
      <div
        className={cn('flex flex-col items-center justify-center gap-3 bg-[#e4e8ed] text-[#747d89]', className)}
        role={alt ? 'img' : undefined}
        aria-label={alt ? `${alt} — 이미지 없음` : undefined}
        aria-hidden={!alt || undefined}
      >
        <img src="/icons/movie.svg" className="size-10 opacity-30" alt="" />
        <span className="text-xs">이미지 준비 중</span>
      </div>
    );
  }

  return (
    <img
      className={cn('bg-[#e4e8ed] object-cover', className)}
      src={`https://image.tmdb.org/t/p/${backdrop ? 'w1280' : 'w500'}${path}`}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      onError={() => setFailedPath(path)}
    />
  );
}
