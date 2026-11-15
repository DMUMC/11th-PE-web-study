import { Link, useNavigate } from "@tanstack/react-router";
import { useAuthStore } from "@/stores/auth-store";

function Header() {
  const navigate = useNavigate();
  const nickname = useAuthStore((state) => state.nickname);
  const accessToken = useAuthStore((state) => state.accessToken);
  const logout = useAuthStore((state) => state.logout);

  const isLoggedIn = accessToken !== null;

  const handleLogout = () => {
    logout();
    navigate({ to: "/" });
  };

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
          <a href="/mypage" className="nav-link">
            내 정보
          </a>
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

        {isLoggedIn ? (
          <>
            <span className="text-xs font-bold text-slate-700">
              {nickname}님
            </span>
            <button type="button" className="login-button" onClick={handleLogout}>
              로그아웃
            </button>
          </>
        ) : (
          <Link to="/login" className="login-button">
            로그인
          </Link>
        )}
      </div>
    </header>
  );
}

export default Header;