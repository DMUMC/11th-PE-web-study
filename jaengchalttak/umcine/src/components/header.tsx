export default function Header() {
  return (
    <header className="header">
      <div className="header-left">
        <div className="header-logo">
          <img
            className="header-logo-icon"
            src="/icons/movie-icons/movie.svg"
            alt=""
            style={{ border: "2px solid #1d1e20", borderRadius: 8, padding: 3 }}
          />
          <span className="header-logo-text">UMCine</span>
        </div>
        <nav className="header-nav" aria-label="주 메뉴">
          <span className="header-nav-link active" aria-current="page">영화</span>
          <span className="header-nav-link">검색</span>
          <span className="header-nav-link">내 정보</span>
        </nav>
      </div>
      <div className="header-right">
        <button className="search-button" type="button" aria-label="검색">
          <img src="/icons/movie-icons/search.svg" alt="" />
        </button>
        <button className="login-button" type="button">로그인</button>
      </div>
    </header>
  );
}
