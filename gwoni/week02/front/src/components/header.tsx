export default function Header() {
  return (
    <header className="header" style={{ display: "flex" }}>
      <a href="/">
        <img src="/icons/movie.svg" alt="" width={24} height={24} />
        <span>UMCine</span>
      </a>

      <nav>
        <a href="/">영화</a>
        <a href="/search">검색</a>
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
