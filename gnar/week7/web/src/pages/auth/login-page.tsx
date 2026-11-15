import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { readProfile, saveProfile } from "../profile/demo-profile";
import "./mission-auth.css";

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <section className="week7-auth" aria-labelledby="week7-login-title">
      <h1 id="week7-login-title">로그인</h1>
      <form onSubmit={(event) => {
        event.preventDefault();
        const profile = readProfile();
        const loginEmail = email.trim();
        if (profile.email !== loginEmail) {
          saveProfile({ email: loginEmail, nickname: "영화친구" });
        }
        void navigate({ to: "/mypage" });
      }}>
        <label>
          이메일
          <input type="email" value={email} autoComplete="username" required
            onChange={(event) => setEmail(event.target.value)} />
        </label>
        <label>
          비밀번호
          <input type="password" value={password} autoComplete="current-password" required
            onChange={(event) => setPassword(event.target.value)} />
        </label>
        <button type="submit" disabled={!email.trim() || !password}>로그인</button>
      </form>
      <a href="/signup">회원가입</a>
    </section>
  );
}
