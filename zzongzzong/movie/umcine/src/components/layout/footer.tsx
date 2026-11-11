export default function Footer() {
    return (
        <footer
            aria-label="데이터 출처"
            className="flex flex-wrap items-center justify-end
        gap-4 px-[80px] py-4 border-t border-[#E3E6EB]
        text-[12px]"
        >
            <a
                href="https://www.themoviedb.org"
                target="_blank"
                rel="noreferrer"
            >
                <img
                    src="/images/tmdb-logo.svg"
                    alt="TMDB"
                    className="w-[80px]"
                />
            </a>

            <p>
                This product uses the TMDB API but is not endorsed or
                certified by TMDB.
            </p>
        </footer>
    );
}