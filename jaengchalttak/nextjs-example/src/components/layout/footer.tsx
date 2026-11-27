import Image from "next/image";
export default function Footer() {
  return (
    <footer className="border-t border-[#e3e6eb] bg-white px-5 py-8 text-center text-xs text-[#676d76]" aria-label="데이터 출처">
      <a href="https://www.themoviedb.org" target="_blank" rel="noreferrer" className="inline-block">
        <Image width={123} height={16} unoptimized src="/images/logos/tmdb-logo.svg" alt="TMDB" className="mx-auto mb-3" />
      </a>
      <p>This product uses the TMDB API but is not endorsed or certified by TMDB.</p>
    </footer>
  );
}
