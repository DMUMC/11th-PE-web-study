import { useState } from "react";
import { Link } from "@tanstack/react-router";

export function MyPage() {
  // 8주차에서 실제 GET /members/me 응답 데이터로 대체될 mock 상태
  const [profile] = useState({
    id: 1,
    email: "hoon@umc.com",
    nickname: "훈이",
    role: "USER (일반 회원)",
    createdAt: "2026-11-01",
    ratedCount: 4,
  });

  const handleLogout = () => {
    if (confirm("로그아웃 하시겠습니까?")) {
      alert("로그아웃 되었습니다.");
      window.location.href = "/";
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-140px)] items-center justify-center py-10 px-4">
      <div className="w-full max-w-xl rounded-2xl bg-white p-8 shadow-sm border border-neutral-200">
        <div className="flex items-center justify-between pb-6 border-b border-neutral-200">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">내 정보</h1>
            <p className="mt-1 text-sm text-neutral-500">
              회원님의 프로필 정보와 활동 내역입니다.
            </p>
          </div>
          <Link
            to="/my/edit"
            className="rounded-lg bg-neutral-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-neutral-800"
          >
            프로필 수정
          </Link>
        </div>

        {/* 프로필 요약 카드 */}
        <div className="mt-6 flex items-center gap-5 rounded-xl bg-neutral-50 p-5 border border-neutral-100">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
            <img
              src="/icons/movie-icons/person.svg"
              alt="프로필 아이콘"
              className="h-8 w-8"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-neutral-900">
                {profile.nickname}
              </h2>
              <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-600 border border-blue-200">
                {profile.role}
              </span>
            </div>
            <p className="text-sm text-neutral-500 mt-0.5">{profile.email}</p>
          </div>
        </div>

        {/* 상세 정보 목록 */}
        <div className="mt-6 divide-y divide-neutral-100 text-sm">
          <div className="flex justify-between py-3.5">
            <span className="font-medium text-neutral-500">이메일 계정</span>
            <span className="font-semibold text-neutral-900">{profile.email}</span>
          </div>
          <div className="flex justify-between py-3.5">
            <span className="font-medium text-neutral-500">닉네임</span>
            <span className="font-semibold text-neutral-900">
              {profile.nickname}
            </span>
          </div>
          <div className="flex justify-between py-3.5">
            <span className="font-medium text-neutral-500">가입일</span>
            <span className="text-neutral-700">{profile.createdAt}</span>
          </div>
          <div className="flex justify-between py-3.5">
            <span className="font-medium text-neutral-500">
              남긴 평점 및 리뷰
            </span>
            <span className="font-semibold text-blue-600">
              {profile.ratedCount}편
            </span>
          </div>
        </div>

        {/* 로그아웃 버튼 */}
        <div className="mt-8 pt-4 border-t border-neutral-100 flex justify-end">
          <button
            type="button"
            onClick={handleLogout}
            className="text-xs font-medium text-red-500 hover:text-red-700 transition"
          >
            로그아웃
          </button>
        </div>
      </div>
    </div>
  );
}
