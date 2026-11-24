import { Link } from "@tanstack/react-router";

export default function Header() {
    return (
        <header className="flex items-center w-full h-[68] px-[80px] py-[16px] border-b-[1px] border-[#E3E6EB]">
            <div className="flex items-center gap-[10px]">
                <div className="border-2 border-[##17191E] w-[32px] h-[32px] flex justify-center items-center rounded-[8px]">
                    <img src="/icon/movie-icons/movie.svg" alt="영화 아이콘" className='w-[20px] h-[16px]' />
                </div>
                <p className="text-[20px] font-[900]">UMCine</p>
            </div>
            <div className="flex items-center gap-[30px] pl-[42px] text-[14px] font-[700] text-[#606774]">
                <Link to="/"><p className="text-[#17191E] underline">영화</p></Link>
                <Link to="/search"><p>검색</p></Link>
                <Link to="/myPage"><p>내 정보</p></Link>
            </div>
            <div className="ml-auto flex justify-end gap-[10px]">
                <div className="w-[42px] h-[42px] flex items-center justify-center border-1 border-[#E3E6EB] rounded-[8px]">
                    <img src="/icon/movie-icons/search.svg" className="w-[18px] h-[18px]" />
                </div>
                <div className="w-[71px] h-[42px] flex items-center bg-[#2563EB] rounded-[8px] 
            text-white text-[14px] font-extrabold justify-center">
                    <p>로그인</p>
                </div>
            </div>
        </header>
    )
}