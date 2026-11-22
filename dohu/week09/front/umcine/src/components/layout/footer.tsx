import Image from "next/image";

export function Footer() {
  return (
    <footer className="border-t border-line bg-white">
      <div className="mx-auto flex h-14 max-w-[1440px] items-center justify-end gap-2 px-5 lg:px-20">
        {/* SVG는 next/image가 변환하지 않으므로 원본을 그대로 쓴다. */}
        <Image
          src="/images/logos/tmdb-logo.svg"
          alt="TMDB"
          width={24}
          height={3}
          unoptimized
        />
        <p className="text-xs text-gray-500">
          This product uses the TMDB API but is not endorsed or certified by{" "}
          <a
            className="underline"
            href="https://www.themoviedb.org/"
            target="_blank"
            rel="noreferrer"
          >
            TMDB
          </a>
          .
        </p>
      </div>
    </footer>
  );
}
