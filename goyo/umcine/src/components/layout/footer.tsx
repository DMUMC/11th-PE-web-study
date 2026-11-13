import { Link } from "@tanstack/react-router";

export default function Footer() {
  return (
    <footer className="w-full border-t border-[#E3E6EB] bg-white px-4 py-6 font-[Pretendard,sans-serif] sm:px-8 lg:px-12">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Link
          to="/"
          className="flex items-center gap-1.5 no-underline"
        >
          <img
            src="/movie-icons/movie.svg"
            alt="UMCine 로고"
            className="block h-6 w-6 rounded-lg border-2 border-black p-0.5"
          />

          <span className="text-sm font-bold text-[#17191E]">
            UMCine
          </span>
        </Link>

        <div className="text-xs leading-5 text-[#969DA8] sm:text-right">
          <p className="m-0">
            This product uses the TMDB API but is not endorsed or certified by TMDB.
          </p>
          <p className="m-0 mt-1">
            © 2026 UMCine. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}