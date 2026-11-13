import profileImg from "../../assets/profileImg.png";
import spiderman from "../../assets/spiderman.png";
import odisay from "../../assets/odisay.png";
import minion from "../../assets/minion.png";
import leftArrow from "../../assets/leftArrow.png";
import rightArrow from "../../assets/rightArrow.png";
import profileEdit from "../../assets/profileEdit.png";
import { Link } from "@tanstack/react-router";

export function MyPageEdit() {
  return (
    <div className="py-[24px] flex flex-col w-[1280px] min-h-screen">
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-[8px]">
          <p className="text-[31px] font-bold">내 정보 수정</p>
          <p className="text-[14px] text-[#606774]">닉네임과 프로필 이미지만 변경할 수 있어요.</p>
        </div>
        <Link to="/myPage">
          <p
            className="w-[110px] h-[42px] flex items-center justify-center bg-[#2563EB] rounded-[8px] text-white font-bold">
            변경사항 저장
          </p>
        </Link>
      </div>
      <div className=" mt-[50px] pb-[10px]">
        <div className="flex justifyc-center items-center justify-end gap-[84px]">
          <div className="flex flex-col items-center gap-[4px]">
            <img src={profileImg} alt="프로필 이미지"
              className="w-[82px] h-[82px]" />
            <img src={profileEdit} alt="프로필 이미지"
              className="absolute w-[24px] h-[24px] ml-[60px] mt-[56px]" />
            <p className="text-[15px] font-bold">프로필 이미지</p>
            <p className="text-[11px] text-[#969DA8]">선택 사항 · 최대 5MB</p>
          </div>
          <div className="flex flex-col">
            <div className="flex flex-col">
              <p className="text-[#17191E] text-[13px] font-bold">닉네임</p>
              <input
                placeholder="gs0428"
                className="flex items-center placeholder:text-[#17191E] placeholder:text-[14px] w-[840px] h-[50px] border-1 border-[#E3E6EB] bg-white rounded-[8px] px-[13px] py-[14px]" />
              <p className="text-[12px] ml-[760px] mt-[-34px] font-bold text-[#2563EB] cursor-pointer">중복 확인</p>
            </div>
            <div className="mt-[30px] flex flex-col">
              <p className="text-[#17191E] text-[13px] font-bold">이메일</p>
              <input
                placeholder="gwangsoo@cinemalab.kr"
                className="flex items-center placeholder:text-[#17191E] placeholder:text-[14px] w-[840px] h-[50px] border-1 border-[#E3E6EB] bg-white rounded-[8px] px-[13px] py-[14px]" />
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between mt-auto w-[1280px] h-[84px] bg-[#D92D201A] border-1 border-[#D92D20] rounded-[10px] p-[20px] gap-[4px]">
        <div className="flex flex-col">
          <p className="text-[14px] text-[#D92D20] font-bold">회원 탈퇴</p>
          <p className="text-[11px] text-[#D92D20]">탈퇴하면 작성한 평점, 후기와 즐겨찾기가 모두 삭제되며 복구할 수 없습니다.</p>
        </div>
        <p className="border-1 border-[#D92D20] rounded-[8px] w-[86px] h-[42px] flex items-center justify-center text-[14px] text-[#D92D20] font-bold bg-white">회원 탈퇴</p>
      </div>
    </div>
  );
}
