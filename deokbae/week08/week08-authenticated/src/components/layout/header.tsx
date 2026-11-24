import { Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getMe } from "@/api/members/me";
import { useAuthStore } from "@/stores/auth-store";

function Header() {
  const navigate = useNavigate();
  const accessToken = useAuthStore((state) => state.accessToken);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  const meQuery = useQuery({
    queryKey: ["members", "me"],
    queryFn: getMe,
    enabled: Boolean(accessToken),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  const nickname = meQuery.data?.nickname;

  const handleLogout = () => {
    setAccessToken(null);
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

        {!accessToken ? (
          <Link to="/login" className="login-button">
            로그인
          </Link>
        ) : meQuery.isLoading ? (
          <span className="inline-block h-8 w-24 animate-pulse rounded-lg bg-gray-200" />
        ) : (
          <>
            {nickname && (
              <span className="text-xs font-bold text-slate-700">
                {nickname}님
              </span>
            )}
            <button
              type="button"
              className="login-button"
              onClick={handleLogout}
            >
              로그아웃
            </button>
          </>
        )}
      </div>
    </header>
  );
}

export default Header;