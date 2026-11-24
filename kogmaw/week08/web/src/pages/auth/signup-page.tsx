import { useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { getApiErrorMessage } from "../../api/api-client";
import { useSignupMutation } from "../../hooks/use-member";
import "./mission-auth.css";

const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;

export function SignupPage() {
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const signup = useSignupMutation();
  const trimmedNickname = nickname.trim();
  const canSubmit = email.trim() && trimmedNickname.length >= 2 &&
    trimmedNickname.length <= 12 && passwordPattern.test(password);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (canSubmit && !signup.isPending) {
      signup.mutate({ email: email.trim(), nickname: trimmedNickname, password });
    }
  }

  return (
    <main className="week7-auth" aria-labelledby="signup-title">
      <h1 id="signup-title">회원가입</h1>
      <form onSubmit={handleSubmit}>
        <label>
          이메일
          <input type="email" value={email} autoComplete="username" required
            onChange={(event) => setEmail(event.target.value)} />
        </label>
        <label>
          닉네임
          <input value={nickname} minLength={2} maxLength={12} autoComplete="nickname" required
            onChange={(event) => setNickname(event.target.value)} />
        </label>
        <label>
          비밀번호
          <input type="password" value={password} autoComplete="new-password" required
            aria-describedby="signup-password-help"
            onChange={(event) => setPassword(event.target.value)} />
          <span id="signup-password-help" className="text-sm font-normal text-slate-600">
            대문자, 소문자, 숫자, 특수문자(!@#$%^&*)를 포함한 8자 이상
          </span>
        </label>
        {signup.isError && <p role="alert" className="text-red-700">{getApiErrorMessage(signup.error)}</p>}
        <button type="submit" disabled={!canSubmit || signup.isPending}>
          {signup.isPending ? "가입 중…" : "가입하기"}
        </button>
      </form>
      <Link to="/login">로그인 페이지로 이동</Link>
    </main>
  );
}
