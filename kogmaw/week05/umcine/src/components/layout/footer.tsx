export function Footer() {
  return (
    <footer className="mt-auto border-t border-[#eef0f3] bg-white px-4 py-7 text-center" aria-label="데이터 출처">
      <a className="inline-flex rounded focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2463cf]" href="https://www.themoviedb.org/" target="_blank" rel="noreferrer" aria-label="영화 데이터 출처: TMDB (새 탭)">
        <img src="/images/logos/tmdb-logo.svg" alt="TMDB" className="h-auto w-[108px]" width="108" height="14" />
      </a>
      <p className="mt-2 text-[10px] leading-5 text-[#7b838e]">
        This product uses the TMDB API but is not endorsed or certified by TMDB.
      </p>
    </footer>
  );
}
