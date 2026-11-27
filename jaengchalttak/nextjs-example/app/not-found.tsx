import Link from "next/link";

export default function NotFound() {
  return (
    <main className="space-y-3 px-5 py-12 text-center">
      <p>페이지를 찾을 수 없어요.</p>
      <Link className="text-[#2864dc] underline" href="/">영화 목록으로</Link>
    </main>
  );
}
