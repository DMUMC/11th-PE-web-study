import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { getApiErrorMessage } from "../../api/api-client";
import type { MemberInfo } from "../../api/member-api";
import { useMe, useUpdateMeMutation } from "../../hooks/use-member";
import "../auth/mission-auth.css";

export function EditProfilePage() {
  const me = useMe();

  return (
    <main className="week7-auth" aria-labelledby="edit-title">
      <h1 id="edit-title">내 정보 수정</h1>
      {me.isLoading && <p role="status">내 정보를 불러오는 중…</p>}
      {me.isError && <p role="alert" className="text-red-700">{getApiErrorMessage(me.error)}</p>}
      {me.data && <EditProfileForm profile={me.data} />}
      <Link to="/mypage">취소</Link>
    </main>
  );
}

function EditProfileForm({ profile }: { profile: MemberInfo }) {
  const navigate = useNavigate();
  const [draft, setDraft] = useState<string | null>(null);
  const update = useUpdateMeMutation();
  const nickname = (draft ?? profile.nickname).trim();
  const canSave = nickname.length >= 2 && nickname.length <= 12 && nickname !== profile.nickname;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSave || update.isPending) return;

    update.mutate({ nickname }, { onSuccess: () => void navigate({ to: "/mypage" }) });
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        이메일
        <input type="email" value={profile.email} readOnly />
      </label>
      <label>
        닉네임
        <input value={draft ?? profile.nickname} onChange={(event) => setDraft(event.target.value)}
          required minLength={2} maxLength={12} />
      </label>
      {update.isError && <p role="alert" className="text-red-700">{getApiErrorMessage(update.error)}</p>}
      <button type="submit" disabled={!canSave || update.isPending}>
        {update.isPending ? "저장 중…" : "저장하기"}
      </button>
    </form>
  );
}
