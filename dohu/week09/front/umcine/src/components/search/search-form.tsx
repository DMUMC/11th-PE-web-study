"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type SubmitEvent } from "react";
import { Icon } from "@/components/common/icon";
import { cn } from "@/utils/cn";

interface SearchFormProps {
  initialText: string;
  hasQuery: boolean;
}

// 입력과 제출만 브라우저에서 처리하고, 검색 결과는 서버가 주소의 query로 만든다.
export function SearchForm({ initialText, hasQuery }: SearchFormProps) {
  const router = useRouter();
  const [searchText, setSearchText] = useState(initialText);

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextQuery = searchText.trim();
    router.push(nextQuery ? `/search?query=${encodeURIComponent(nextQuery)}` : "/search");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "flex items-center bg-white",
        hasQuery
          ? "mt-4 h-[52px] gap-3 rounded-lg border border-line pl-4 pr-1.5"
          : "mx-auto mt-8 h-[72px] w-full max-w-[788px] gap-4 rounded-xl border-2 border-ink pl-6 pr-3.5 shadow-lg",
      )}
    >
      <Icon name="search" className="text-ink-sub" />
      <input
        aria-label="검색어"
        placeholder="예: 스파이더맨"
        value={searchText}
        onChange={(event) => setSearchText(event.target.value)}
        className={cn(
          "h-full min-w-0 flex-1 bg-transparent outline-none placeholder:text-ink-muted",
          hasQuery ? "text-sm" : "text-lg",
        )}
      />
      {hasQuery && (
        <Link
          href="/search"
          aria-label="검색어 지우기"
          className="flex size-9 items-center justify-center text-ink"
        >
          <Icon name="close" />
        </Link>
      )}
      <button
        type="submit"
        className={cn(
          "shrink-0 rounded-md bg-ink px-4 text-sm font-bold text-white",
          hasQuery ? "h-10" : "h-11",
        )}
      >
        {hasQuery ? "다시 검색" : "검색"}
      </button>
    </form>
  );
}
