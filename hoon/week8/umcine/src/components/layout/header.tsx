import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getMe } from "../../api/members/me";
import { useAuthStore } from "../../stores/auth-store";

function Header() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const logout = useAuthStore((state) => state.logout);

  const meQuery = useQuery({
    queryKey: ["members", "me"],
    queryFn: getMe,
    enabled: Boolean(accessToken),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  const handleLogout = () => {
    if (confirm("로그아웃 하시겠습니까?")) {
      logout();
      alert("로그아웃 되었습니다.");
      window.location.href = "/";
    }
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
          <Link
            to="/my"
            className="nav-link"
            activeProps={{ className: "nav-link active" }}
          >
            내 정보
          </Link>
        </nav>
      </div>

      <div className="header-right flex items-center gap-3">
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
          <span className="h-8 w-20 animate-pulse rounded-lg bg-gray-200" />
        ) : (
          <div className="flex items-center gap-2">
            <Link
              to="/my"
              className="login-button"
              title={`${meQuery.data?.email || ""} (${meQuery.data?.nickname || "마이페이지"})`}
            >
              {meQuery.data?.nickname ? `${meQuery.data.nickname}님` : "마이페이지"}
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="text-xs text-neutral-500 hover:text-red-500 transition px-2 py-1"
            >
              로그아웃
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
