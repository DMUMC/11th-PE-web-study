"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type SubmitEvent } from "react";
import { AccountField } from "../../components/account/account-field";
import { AccountPanel } from "../../components/account/account-panel";
import type { MemberInfo } from "../../api/members/me";
import { apiErrorMessage } from "../../api/api-response";
import { useMeQuery } from "../../hooks/use-me-query";
import { useUpdateMeMutation } from "../../hooks/use-update-me-mutation";

export function EditProfilePage() {
  const me = useMeQuery();
  return (
    <AccountPanel title="내 정보 수정" description="프로필에 표시할 닉네임을 바꿀 수 있어요.">
      {me.isPending ? <p role="status" className="text-sm">내 정보를 불러오는 중이에요.</p> : me.isError ? (
        <p role="alert" className="text-sm">내 정보를 불러오지 못했어요.{" "}
          <button type="button" onClick={() => void me.refetch()} className="text-[#2864dc] underline">다시 시도</button>
        </p>
      ) : <EditProfileForm member={me.data} />}
    </AccountPanel>
  );
}

function EditProfileForm({ member }: { member: MemberInfo }) {
  const router = useRouter();
  const update = useUpdateMeMutation();
  const [nickname, setDraftNickname] = useState(member.nickname);
  const normalizedNickname = nickname.trim();
  const isValid = normalizedNickname.length >= 2 && normalizedNickname.length <= 12;
  const canSubmit = isValid && normalizedNickname !== member.nickname && !update.isPending;

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) return;
    update.mutate({ nickname: normalizedNickname }, { onSuccess: () => router.push("/mypage") });
  }

  return (
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <AccountField label="이메일" icon="mail" type="email" value={member.email} readOnly />
        <AccountField label="닉네임" icon="person" autoComplete="nickname" value={nickname}
          onChange={(event) => setDraftNickname(event.target.value)}
          disabled={update.isPending}
          error={!isValid ? "닉네임은 2~12자로 입력해 주세요." : undefined} />
        <div className="grid grid-cols-2 gap-2">
          <Link href="/mypage" className="flex h-12 items-center justify-center rounded-lg border border-[#e3e6eb] text-sm font-semibold hover:bg-[#f7f8fa]">
            취소
          </Link>
          <button type="submit" disabled={!canSubmit}
            className="h-12 rounded-lg bg-[#2864dc] text-sm font-semibold text-white hover:bg-[#1f56c7] disabled:bg-[#e3e6eb] disabled:text-[#676d76]">
            {update.isPending ? "저장 중" : "저장하기"}
          </button>
        </div>
        {update.isError && <p role="alert" className="text-sm text-red-700">{apiErrorMessage(update.error, "내 정보 수정에 실패했어요.")}</p>}
      </form>
  );
}
