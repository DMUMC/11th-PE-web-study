const NAV_ITEMS = ["영화", "검색", "내 정보"];

export default function Header() {
  return (
    <header className="header">
      <div className="header__inner">
        <a className="header__logo" href="/">
          <span className="header__logo-mark">
            <img src="/icons/movie.svg" alt="" width={24} height={24} />
          </span>
          <span className="header__logo-text">UMCine</span>
        </a>

        <nav className="header__nav" aria-label="주요 메뉴">
          {NAV_ITEMS.map((item, index) => (
            <a
              key={item}
              href="/"
              className={
                index === 0
                  ? "header__nav-link header__nav-link--active"
                  : "header__nav-link"
              }
              aria-current={index === 0 ? "page" : undefined}
            >
              {item}
            </a>
          ))}
        </nav>

        <div className="header__actions">
          <button type="button" className="header__search" aria-label="검색">
            <img src="/icons/search.svg" alt="" width={24} height={24} />
          </button>
          <button type="button" className="header__login">
            로그인
          </button>
        </div>
      </div>
    </header>
  );
}
