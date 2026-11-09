import { Link } from "@tanstack/react-router";
import { AccountPanel } from "../../components/account/account-panel";
import { useProfilePreviewStore } from "../../stores/profile-preview-store";

export function ProfilePage() {
  const email = useProfilePreviewStore((state) => state.email);
  const nickname = useProfilePreviewStore((state) => state.nickname);

  return (
    <AccountPanel title="내 정보" description="내 프로필 정보를 확인해 보세요.">
      <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full bg-[#f0f5ff]">
        <img className="size-8" src="/icons/movie-icons/person.svg" alt="" />
      </div>
      <dl className="divide-y divide-[#e3e6eb] rounded-xl border border-[#e3e6eb] px-4 text-sm">
        <div className="flex flex-wrap justify-between gap-2 py-4">
          <dt className="font-semibold">이메일</dt><dd className="break-all text-[#676d76]">{email}</dd>
        </div>
        <div className="flex flex-wrap justify-between gap-2 py-4">
          <dt className="font-semibold">닉네임</dt><dd className="break-all text-[#676d76]">{nickname}</dd>
        </div>
      </dl>
      <Link to="/mypage/edit" className="mt-6 flex h-12 items-center justify-center gap-2 rounded-lg bg-[#2864dc] text-sm font-semibold text-white hover:bg-[#1f56c7]">
        <img className="size-4 brightness-0 invert" src="/icons/movie-icons/edit.svg" alt="" />
        내 정보 수정
      </Link>
    </AccountPanel>
  );
}
