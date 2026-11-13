import { cn } from "../../utils/cn";

interface MoviePosterProps {
  src: string | null;
  alt: string;
  className?: string;
}

// 이미지 경로가 없으면 같은 크기의 회색 영역에 "이미지 없음"을 보여 준다.
export function MoviePoster({ src, alt, className }: MoviePosterProps) {
  if (!src) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-gray-200 text-xs text-ink-muted",
          className,
        )}
        role="img"
        aria-label={alt}
      >
        이미지 없음
      </div>
    );
  }

  return <img className={cn("object-cover", className)} src={src} alt={alt} />;
}
