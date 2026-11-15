import { Link } from "@tanstack/react-router";

function Header() {
  return (
    <header className="header">
      <div className="header-left">
        <Link to="/" className="logo">
          <img
            src="/icons/movie-icons/movie.svg"
            alt="UMCine 로고"
            className="logo-icon"
          />
          <span className="logo-text">UMCine</span>
        </Link>
        <nav className="nav-menu">
          <Link
            to="/"
            className="nav-link"
            activeProps={{ className: "nav-link active" }}
            activeOptions={{ exact: true }}
          >
            영화
          </Link>
          <Link
            to="/search"
            className="nav-link"
            activeProps={{ className: "nav-link active" }}
          >
            검색
          </Link>
          <Link
            to="/my"
            className="nav-link"
            activeProps={{ className: "nav-link active" }}
          >
            내 정보
          </Link>
        </nav>
      </div>

      <div className="header-right">
        <Link to="/search" className="search-button" aria-label="검색">
          <img
            src="/icons/movie-icons/search.svg"
            alt=""
            className="search-icon"
          />
        </Link>
        <Link to="/login" className="login-button">
          로그인
        </Link>
      </div>
    </header>
  );
}

export default Header;