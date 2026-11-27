import Link from "next/link";
import { cn } from "@/utils/cn";
import { Icon } from "../common/icon";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  // 주소의 ?page로 이동하는 목록은 href를, 화면 안 상태로 넘기는 목록은 onPageChange를 쓴다.
  getHref?: (page: number) => string;
  onPageChange?: (page: number) => void;
}

const itemClass =
  "flex size-9 items-center justify-center rounded-md text-sm font-semibold text-ink-sub";
const disabledClass = "cursor-default text-gray-300";

export function Pagination({
  currentPage,
  totalPages,
  getHref,
  onPageChange,
}: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  function renderItem(
    page: number,
    label: React.ReactNode,
    options: { ariaLabel?: string; disabled?: boolean; active?: boolean } = {},
  ) {
    const { ariaLabel, disabled = false, active = false } = options;
    const className = cn(
      itemClass,
      active ? "bg-ink text-white" : !disabled && "hover:bg-line",
      disabled && disabledClass,
    );

    if (disabled) {
      return (
        <span className={className} aria-label={ariaLabel} aria-disabled="true">
          {label}
        </span>
      );
    }
    if (getHref) {
      return (
        <Link
          href={getHref(page)}
          className={className}
          aria-label={ariaLabel}
          aria-current={active ? "page" : undefined}
          scroll={false}
        >
          {label}
        </Link>
      );
    }
    return (
      <button
        type="button"
        className={className}
        aria-label={ariaLabel}
        aria-current={active ? "page" : undefined}
        onClick={() => onPageChange?.(page)}
      >
        {label}
      </button>
    );
  }

  return (
    <nav className="mt-10 flex justify-center gap-1" aria-label="페이지 이동">
      {renderItem(currentPage - 1, <Icon name="chevron-left" />, {
        ariaLabel: "이전 페이지",
        disabled: currentPage === 1,
      })}
      {pages.map((page) => (
        <span key={page}>{renderItem(page, page, { active: page === currentPage })}</span>
      ))}
      {renderItem(currentPage + 1, <Icon name="chevron-right" />, {
        ariaLabel: "다음 페이지",
        disabled: currentPage === totalPages,
      })}
    </nav>
  );
}
