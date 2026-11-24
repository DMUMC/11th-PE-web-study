function Header() {
  return (
    <header className="header">
      <div className="header-left">
        <div className="logo">
          <img
            src="/icons/movie-icons/movie.svg"
            alt="UMCine 로고"
            className="logo-icon"
          />
          <span className="logo-text">UMCine</span>
        </div>
        <nav className="nav-menu">
          <a href="/" className="nav-link active">
            영화
          </a>
          <a href="/search" className="nav-link">
            검색
          </a>
          <a href="/mypage" className="nav-link">
            내 정보
          </a>
        </nav>
      </div>

      <div className="header-right">
        <button className="search-button" aria-label="검색">
          <img
            src="/icons/movie-icons/search.svg"
            alt=""
            className="search-icon"
          />
        </button>
        <button className="login-button">로그인</button>
      </div>
    </header>
  );
}

export default Header;
