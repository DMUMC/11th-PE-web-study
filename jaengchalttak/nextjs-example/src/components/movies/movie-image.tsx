"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "../../utils/cn";

export function MovieImage({ src, alt, className, backdrop = false }: {
  src: string | null;
  alt: string;
  className?: string;
  backdrop?: boolean;
}) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  return src && failedSrc !== src ? (
    <Image src={src} alt={alt} className={className} width={backdrop ? 1280 : 500}
      height={backdrop ? 720 : 750} unoptimized onError={() => setFailedSrc(src)} />
  ) : (
    <div role="img" aria-label={alt || "배경 이미지 없음"} className={cn("flex items-center justify-center bg-[#e3e6eb] text-sm text-[#676d76]", className)}>
      이미지 없음
    </div>
  );
}
