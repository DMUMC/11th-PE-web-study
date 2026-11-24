import profileImg from "../../assets/profileImg.png";
import spiderman from "../../assets/spiderman.png";
import odisay from "../../assets/odisay.png";
import minion from "../../assets/minion.png";
import leftArrow from "../../assets/leftArrow.png";
import rightArrow from "../../assets/rightArrow.png";
import { Link } from "@tanstack/react-router";

export function MyPage() {
  return (
    <div className="px-[80px] py-[24px] flex flex-col w-[1280px] min-h-screen">
      <div className="flex justify-between">
        <p className="text-[31px] font-bold">내 정보</p>
        <Link to="/myPageEdit">
          <p className="w-[86px] h-[42px] flex items-center justify-center bg-[#2563EB] rounded-[8px] text-white font-bold">정보 수정</p></Link>
      </div>
      <div className="mt-[20px] pb-[10px] border-t-1 border-b-1 border-[#E3E6Eb]">
        <p className="mt-[10px] mb-[10px] text-[17px] font-bold">기본 정보</p>
        <div className="flex items-center gap-[28px]">
          <img src={profileImg} alt="프로필 이미지"
            className="w-[82px] h-[82px]" />
          <div className="w-[366px] flex flex-col gap-[8px]">
            <p className="text-[#969DA8] text-[11px]">닉네임</p>
            <p className="text-[14px] font-bold">gs0428</p>
          </div>
          <div className="flex flex-col gap-[8px]">
            <p className="text-[#969DA8] text-[11px]">이메일</p>
            <p className="text-[14px] font-bold">gwangsoo@cinemalab.kr</p>
          </div>
        </div>
      </div>
      <p className="mt-[30px] mb-[10px] text-[17px] font-bold">내 즐겨찾기</p>
      <div className="flex gap-[20px]">
        <div className="flex flex-col gap-[4px]">
          <img src={spiderman} alt="프로필 이미지"
            className="w-[242px] h-[274px]" />
          <p className="text-[14px] font-bold">스파이더맨:브랜드 뉴 데이</p>
          <p className="text-[12px] text-[#969DA8]">2026.07.29</p>
        </div>
        <div className="flex flex-col gap-[4px]">
          <img src={odisay} alt="프로필 이미지"
            className="w-[242px] h-[274px]" />
          <p className="text-[14px] font-bold">오디세이</p>
          <p className="text-[12px] text-[#969DA8]">2026.08.05</p>
        </div>
        <div className="flex flex-col gap-[4px]">
          <img src={minion} alt="프로필 이미지"
            className="w-[242px] h-[274px]" />
          <p className="text-[14px] font-bold">미니언즈 & 몬스터즈</p>
          <p className="text-[12px] text-[#969DA8]">2026.07.15</p>
        </div>
      </div>
      <div className="mt-[30px] flex items-center justify-center gap-[12px]">
        <img src={leftArrow} alt="프로필 이미지"
          className="w-[24px] h-[24px]" />
        <div className="w-[36px] h-[36px] rounded-[7px] flex items-center justify-center bg-black text-white font-bold">1</div>
        <img src={rightArrow} alt="프로필 이미지"
          className="w-[24px] h-[24px]" />
      </div>
    </div>
  );
}
