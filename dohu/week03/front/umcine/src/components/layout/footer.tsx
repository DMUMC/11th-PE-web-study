export function Footer() {
  return (
    <footer className="border-t border-line bg-white">
      <div className="mx-auto flex h-14 max-w-[1440px] items-center justify-end gap-2 px-5 lg:px-20">
        <img
          className="h-auto w-6"
          src="/images/logos/tmdb-logo.svg"
          alt="TMDB"
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
