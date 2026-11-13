import { cn } from "../../utils/cn";

interface IconProps {
  name: string;
  className?: string;
}

// 제공된 아이콘이 검은색 SVG라서 mask로 씌워 글자색을 따라가게 한다.
export function Icon({ name, className }: IconProps) {
  const mask = `url(/icons/${name}.svg) center / contain no-repeat`;

  return (
    <span
      aria-hidden="true"
      className={cn("inline-block size-6 shrink-0 bg-current", className)}
      style={{ mask, WebkitMask: mask }}
    />
  );
}
