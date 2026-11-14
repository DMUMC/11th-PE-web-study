import { Link } from "@tanstack/react-router";
import { readProfile } from "./demo-profile";
import "../auth/mission-auth.css";

export function ProfilePage() {
  const profile = readProfile();

  return (
    <section className="week7-auth" aria-labelledby="week7-profile-title">
      <h1 id="week7-profile-title">내 정보</h1>
      <dl>
        <dt>이메일</dt>
        <dd>{profile.email}</dd>
        <dt>닉네임</dt>
        <dd>{profile.nickname}</dd>
      </dl>
      <Link to="/mypage/edit" className="week7-primary">내 정보 수정</Link>
    </section>
  );
}
