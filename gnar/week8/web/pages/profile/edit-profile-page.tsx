import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateMe } from "../../api/cinema-api";
import type { MemberInfo } from "../../api/cinema-api";
import { getApiErrorMessage } from "../../api/member-api";
import { memberKey, useMember } from "../../hooks/use-member";
import { useAuthStore } from "../../stores/auth-store";
import "../auth/mission-auth.css";

export function EditProfilePage() {
  const member = useMember();

  return (
    <section className="week7-auth" aria-labelledby="edit-title">
      <h1 id="edit-title">내 정보 수정</h1>
      {member.isLoading && <p>내 정보를 불러오는 중…</p>}
      {member.isError && <p role="alert">{getApiErrorMessage(member.error)}</p>}
      {member.data && <EditProfileForm key={member.data.email} profile={member.data} />}
      <Link to="/mypage">취소</Link>
    </section>
  );
}

function EditProfileForm({ profile }: { profile: MemberInfo }) {
  const [nickname, setNickname] = useState(profile.nickname);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const token = useAuthStore((state) => state.accessToken)!;
  const mutation = useMutation({
    mutationFn: (value: string) => updateMe(token, value),
    onSuccess: async (updated) => {
      if (useAuthStore.getState().accessToken !== token) return;
      const key = memberKey(token);
      await queryClient.cancelQueries({ queryKey: key });
      if (useAuthStore.getState().accessToken !== token) return;
      queryClient.setQueryData(key, { ...profile, ...updated });
      void navigate({ to: "/mypage" });
    },
  });
  const canSave = nickname.trim() && nickname.trim() !== profile.nickname;

  return (
    <form onSubmit={(event) => {
      event.preventDefault();
      if (canSave && !mutation.isPending) mutation.mutate(nickname.trim());
    }}>
      <label>
        이메일
        <input type="email" value={profile.email} readOnly />
      </label>
      <label>
        닉네임
        <input value={nickname} onChange={(event) => setNickname(event.target.value)}
          required maxLength={20} disabled={mutation.isPending} />
      </label>
      <button type="submit" disabled={!canSave || mutation.isPending}>
        {mutation.isPending ? "저장 중…" : "저장하기"}
      </button>
      {mutation.isError && <p role="alert">{getApiErrorMessage(mutation.error)}</p>}
    </form>
  );
}
