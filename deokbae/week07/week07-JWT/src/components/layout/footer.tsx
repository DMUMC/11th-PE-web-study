// components/layout/footer.tsx
export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="flex items-center justify-end gap-3 px-10 py-6 text-sm text-slate-500">
        <img
          src = "/umcine-images/images/logos/tmdb-logo.svg"
          alt="TMDB"
          className="h-4 w-auto shrink-0"
        />
        <p>
          This product uses the TMDB API but is not endorsed or certified by{" "}
          <a
            href="https://www.themoviedb.org"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-slate-700"
          >
            TMDB
          </a>
          .
        </p>
      </div>
    </footer>
  );
}

export default Footer;