"use client";

import Link from "next/link";

export function Header() {
  return (
    <header>
      <Link href="/">영화</Link>
      <Link href="/search">검색</Link>
    </header>
  );
}