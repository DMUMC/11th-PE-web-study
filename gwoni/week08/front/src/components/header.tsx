import { Link } from "@tanstack/react-router";
import { useMyInfoQuery } from "../hooks/use-my-info-query";
import { useAuthStore } from "../stores/auth-store";

export default function Header() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const meQuery = useMyInfoQuery();

  return (
    <header className="header" style={{ display: "flex" }}>
      <Link to="/">
        <img src="/icons/movie.svg" alt="" width={24} height={24} />
        <span>UMCine</span>
      </Link>

      <nav>
        <Link to="/">영화</Link>
        <Link to="/search">검색</Link>
        <Link to="/my">내 정보</Link>
      </nav>

      <div>
        <button type="button">
          <img src="/icons/search.svg" alt="검색" width={20} height={20} />
        </button>
        {/* 로그인 전 → 로그인 링크 / 첫 조회 중 → 로딩 / 그 외 → 마이페이지 */}
        {!accessToken ? (
          <Link to="/login">로그인</Link>
        ) : meQuery.isLoading ? (
          <span className="inline-block h-10 w-24 animate-pulse rounded-lg bg-gray-200" />
        ) : (
          <Link to="/my">마이페이지</Link>
        )}
      </div>
    </header>
  );
}
