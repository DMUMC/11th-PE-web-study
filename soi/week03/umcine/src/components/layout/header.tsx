import { Link } from "@tanstack/react-router";

export default function Header() {
  return (
    <header className="flex h-[72px] w-full items-center justify-between border-b border-[#eeeeee] bg-white px-20">
      <div className="flex items-center gap-12">
        <div className="flex items-center gap-2 text-lg">
          <img
            className="h-6 w-6"
            src="/icons/movie.svg"
            alt=""
          />
          <strong>UMCine</strong>
        </div>

        <nav className="flex items-center gap-8 text-sm">
          <Link to="/">영화</Link>
          <Link to="/search">검색</Link>
          <span>내 정보</span>
        </nav>
      </div>

      <div className="flex items-center gap-4">
        <img
          className="h-5 w-5"
          src="/icons/search.svg"
          alt="검색"
        />

        <button className="cursor-pointer rounded-[4px] border-0 bg-[#5267e9] px-[18px] py-[10px] text-white">
          로그인
        </button>
      </div>
    </header>
  );
}