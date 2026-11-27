import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex-1 px-5 py-20 text-center text-ink-sub">
      <p>페이지를 찾을 수 없어요.</p>
      <Link href="/" className="mt-3 inline-block text-sm font-bold text-primary">
        영화 목록으로 가기
      </Link>
    </main>
  );
}
