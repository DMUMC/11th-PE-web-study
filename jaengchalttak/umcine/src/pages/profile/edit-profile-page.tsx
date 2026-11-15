import { Link, useNavigate } from "@tanstack/react-router";
import { useState, type SubmitEvent } from "react";
import { AccountField } from "../../components/account/account-field";
import { AccountPanel } from "../../components/account/account-panel";
import { useProfilePreviewStore } from "../../stores/profile-preview-store";

export function EditProfilePage() {
  const navigate = useNavigate();
  const email = useProfilePreviewStore((state) => state.email);
  const currentNickname = useProfilePreviewStore((state) => state.nickname);
  const setNickname = useProfilePreviewStore((state) => state.setNickname);
  const [nickname, setDraftNickname] = useState(currentNickname);
  const normalizedNickname = nickname.trim();
  const isValid = normalizedNickname.length >= 2 && normalizedNickname.length <= 12;

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isValid) return;
    setNickname(normalizedNickname);
    void navigate({ to: "/mypage" });
  }

  return (
    <AccountPanel title="내 정보 수정" description="프로필에 표시할 닉네임을 바꿀 수 있어요.">
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <AccountField label="이메일" icon="mail" type="email" value={email} readOnly />
        <AccountField label="닉네임" icon="person" autoComplete="nickname" value={nickname}
          onChange={(event) => setDraftNickname(event.target.value)}
          error={!isValid ? "닉네임은 2~12자로 입력해 주세요." : undefined} />
        <div className="grid grid-cols-2 gap-2">
          <Link to="/mypage" className="flex h-12 items-center justify-center rounded-lg border border-[#e3e6eb] text-sm font-semibold hover:bg-[#f7f8fa]">
            취소
          </Link>
          <button type="submit" disabled={!isValid || normalizedNickname === currentNickname}
            className="h-12 rounded-lg bg-[#2864dc] text-sm font-semibold text-white hover:bg-[#1f56c7] disabled:bg-[#e3e6eb] disabled:text-[#676d76]">
            저장하기
          </button>
        </div>
      </form>
    </AccountPanel>
  );
}
