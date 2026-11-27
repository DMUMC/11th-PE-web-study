import Link from "next/link";

export default function Header() {
  return (
    <header className="flex items-center w-full h-[68px] px-[80px] py-[16px] border-b border-[#E3E6EB]">
      <Link href="/" className="flex items-center gap-[10px]">
        <span className="border-2 border-[#17191E] w-[32px] h-[32px] flex justify-center items-center rounded-[8px]">
          <img src="/icon/movie-icons/movie.svg" alt="" className="w-[20px] h-[16px]" />
        </span>
        <span className="text-[20px] font-[900]">UMCine</span>
      </Link>
      <nav className="flex items-center gap-[30px] pl-[42px] text-[14px] font-[700] text-[#606774]">
        <Link href="/" className="text-[#17191E] underline">영화</Link>
        <Link href="/search?page=1">검색</Link>
        <Link href="/myPage">내 정보</Link>
      </nav>
      <div className="ml-auto flex justify-end gap-[10px]">
        <Link href="/search?page=1" aria-label="영화 검색" className="w-[42px] h-[42px] flex items-center justify-center border border-[#E3E6EB] rounded-[8px]">
          <img src="/icon/movie-icons/search.svg" alt="" className="w-[18px] h-[18px]" />
        </Link>
        <Link href="/login" className="w-[71px] h-[42px] flex items-center bg-[#2563EB] rounded-[8px] text-white text-[14px] font-extrabold justify-center">로그인</Link>
      </div>
    </header>
  );
}