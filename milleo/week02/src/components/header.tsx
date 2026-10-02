export default function Header() {
  return (
    <header className="header">
      <div className="header-content">
        <div className="brand-row">
          <a className="brand" href="#movies" aria-label="UMCine 영화 목록">
            <span className="brand-icon"><img src="/icons/movie.svg" alt="" /></span>
            <span>UMCine</span>
          </a>
          <nav className="main-nav" aria-label="주 메뉴">
            <a href="#movies" aria-current="page">영화</a>
            <button type="button" disabled title="준비 중">검색</button>
            <button type="button" disabled title="준비 중">내 정보</button>
          </nav>
        </div>
        <div className="header-actions">
          <button className="search-button" type="button" aria-label="검색 (준비 중)" disabled>
            <img src="/icons/search.svg" alt="" />
          </button>
          <button className="login-button" type="button" disabled title="준비 중">로그인</button>
        </div>
      </div>
    </header>
  );
}
