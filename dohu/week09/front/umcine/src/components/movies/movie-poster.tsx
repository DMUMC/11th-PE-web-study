import Image from "next/image";
import { cn } from "@/utils/cn";

interface MoviePosterProps {
  src: string | null;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  // 화면에서 실제로 차지하는 너비를 알려 줘야 next/image가 알맞은 크기의 파일을 고른다.
  sizes?: string;
  // 첫 화면에 바로 보이는 큰 이미지는 지연 로딩 대신 먼저 받는다.
  priority?: boolean;
}

// 이미지 경로가 없으면 같은 크기의 회색 영역에 "이미지 없음"을 보여 준다.
export function MoviePoster({
  src,
  alt,
  className,
  width = 500,
  height = 750,
  sizes = "200px",
  priority = false,
}: MoviePosterProps) {
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

  return (
    <Image
      className={cn("object-cover", className)}
      src={src}
      alt={alt}
      width={width}
      height={height}
      sizes={sizes}
      loading={priority ? "eager" : undefined}
      fetchPriority={priority ? "high" : undefined}
    />
  );
}
