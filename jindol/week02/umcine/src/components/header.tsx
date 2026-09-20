function Header() {
  return (
    <header className="header">
      <div className="header__logo">
        <img src="/movie-icons/logo.svg" alt="" className="header__logo-icon" />
        <span>UMCine</span>
      </div>

      <nav className="header__nav">
        <a href="#" className="header__nav-link header__nav-link--active">영화</a>
        <a href="#" className="header__nav-link">검색</a>
        <a href="#" className="header__nav-link">내 정보</a>
      </nav>

      <div className="header__right">
        <button type="button" className="header__search" aria-label="검색">
          <img src="/movie-icons/search.svg" alt="" />
        </button>
        <button type="button" className="header__login">로그인</button>
      </div>
    </header>
  );
}

export default Header;