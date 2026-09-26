export default function Header() {
  return (
    <header className="header">
      <div className="header-left">
        <div className="logo">
          <img src="/icons/movie.svg" alt="" />
          <strong>UMCine</strong>
        </div>

        <nav className="nav">
          <span>영화</span>
          <span>검색</span>
          <span>내 정보</span>
        </nav>
      </div>

      <div className="header-right">
        <img
          className="search-icon"
          src="/icons/search.svg"
          alt="검색"
        />
        <button className="login-button">로그인</button>
      </div>
    </header>
  );
}