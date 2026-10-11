import { Link } from "@tanstack/react-router";

const activeStyle = {
  className: "font-bold text-[#5267e9]",
};

export function Header() {
  return (
    <header className="flex h-[72px] w-full items-center justify-between border-b border-[#eeeeee] bg-white px-20">
      <div className="flex items-center gap-12">
        <Link to="/" className="flex items-center gap-2 text-lg text-black hover:opacity-90">
          <img className="h-6 w-6" src="/icons/movie.svg" alt="" />
          <strong className="font-bold">UMCine</strong>
        </Link>

        <nav className="flex items-center gap-8 text-sm">
          <Link to="/" activeProps={activeStyle}>
            영화
          </Link>

          <Link to="/search" activeProps={activeStyle}>
            검색
          </Link>

          <span className="text-gray-400 cursor-not-allowed">내 정보</span>
        </nav>
      </div>

      <div className="flex items-center gap-4">
        <Link to="/search">
          <img className="h-5 w-5" src="/icons/search.svg" alt="검색" />
        </Link>

        <button
          type="button"
          className="cursor-pointer rounded-[4px] border-0 bg-[#5267e9] px-[18px] py-[10px] text-white hover:bg-[#4355c9] transition-colors"
        >
          로그인
        </button>
      </div>
    </header>
  );
}

export default Header;
