interface HeaderProps {
  isLoggedIn: boolean;
}

export default function Header({ isLoggedIn }: HeaderProps) {
  return (
    <header className="site-header">
      <div className="header-inner">
        <a className="brand" href="/" aria-label="UMCine 홈">
          <span className="brand-icon">
            <img src="/icons/movie.svg" alt="" aria-hidden="true" />
          </span>
          <span>UMCine</span>
        </a>

        <nav className="main-nav" aria-label="주요 메뉴">
          <a className="active" href="#movies">영화</a>
          <button type="button">검색</button>
          <button type="button">내 정보</button>
        </nav>

        <div className="header-actions">
          <button className="search-button" type="button" aria-label="검색">
            <img src="/icons/search.svg" alt="" aria-hidden="true" />
          </button>
          <button className="account-button" type="button">
            {isLoggedIn ? "마이페이지" : "로그인"}
          </button>
        </div>
      </div>
    </header>
  );
}
