"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { login } from "../../../api/auth/login";
import { useAuthStore } from "../../../stores/auth-store";

export function LoginPage() {
  const router = useRouter();
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await login({ email, password });
      if (!response.isSuccess) {
        throw new Error(response.message || "로그인에 실패했어요.");
      }
      setAccessToken(response.result.accessToken);
      router.push("/mypage");
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : "로그인에 실패했어요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="auth-page">
      <form className="signup-form" onSubmit={handleSubmit}>
        <h1>로그인</h1>
        <div className="auth-form-group">
          <label htmlFor="login-email">이메일</label>
          <div className="auth-field">
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
        </div>
        <div className="auth-form-group">
          <label htmlFor="login-password">비밀번호</label>
          <div className="auth-field">
            <input
              id="login-password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>
        </div>
        {error && <p className="auth-error" role="alert">{error}</p>}
        <button className="auth-primary-button" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "로그인 중..." : "로그인"}
        </button>
        <p className="auth-footer">
          계정이 없으신가요? <Link href="/signup">회원가입</Link>
        </p>
      </form>
    </main>
  );
}
