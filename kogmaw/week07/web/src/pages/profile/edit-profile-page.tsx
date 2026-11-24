import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { readProfile, saveProfile } from "./demo-profile";
import "../auth/mission-auth.css";

export function EditProfilePage() {
  const navigate = useNavigate();
  const [profile] = useState(readProfile);
  const [nickname, setNickname] = useState(profile.nickname);
  const canSave = nickname.trim().length > 0 && nickname.trim() !== profile.nickname;

  return (
    <section className="week7-auth" aria-labelledby="week7-edit-title">
      <h1 id="week7-edit-title">내 정보 수정</h1>
      <form onSubmit={(event) => {
        event.preventDefault();
        if (!canSave) return;
        saveProfile({ ...profile, nickname: nickname.trim() });
        void navigate({ to: "/mypage" });
      }}>
        <label>
          이메일
          <input type="email" value={profile.email} readOnly />
        </label>
        <label>
          닉네임
          <input value={nickname} onChange={(event) => setNickname(event.target.value)}
            required maxLength={20} />
        </label>
        <button type="submit" disabled={!canSave}>저장하기</button>
      </form>
      <Link to="/mypage">취소</Link>
    </section>
  );
}
