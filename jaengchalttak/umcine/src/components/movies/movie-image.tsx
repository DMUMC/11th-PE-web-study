import { useState } from "react";
import { cn } from "../../utils/cn";

export function MovieImage({ src, alt, className }: { src: string | null; alt: string; className?: string }) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  return src && failedSrc !== src ? (
    <img src={src} alt={alt} className={className} onError={() => setFailedSrc(src)} />
  ) : (
    <div role="img" aria-label={alt || "배경 이미지 없음"} className={cn("flex items-center justify-center bg-[#e3e6eb] text-sm text-[#676d76]", className)}>
      이미지 없음
    </div>
  );
}
