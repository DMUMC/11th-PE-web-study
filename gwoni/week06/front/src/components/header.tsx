import { Link } from "@tanstack/react-router";

export default function Header() {
  return (
    <header className="header" style={{ display: "flex" }}>
      <Link to="/">
        <img src="/icons/movie.svg" alt="" width={24} height={24} />
        <span>UMCine</span>
      </Link>

      <nav>
        <Link to="/">영화</Link>
        <Link to="/search">검색</Link>
        <a href="/my">내 정보</a>
      </nav>

      <div>
        <button type="button">
          <img src="/icons/search.svg" alt="검색" width={20} height={20} />
        </button>
        <button type="button">마이페이지</button>
      </div>
    </header>
  );
}
