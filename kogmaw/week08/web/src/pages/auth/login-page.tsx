import { useState, type FormEvent } from "react";
import { getRouteApi, Link } from "@tanstack/react-router";
import { getApiErrorMessage } from "../../api/api-client";
import { useLoginMutation } from "../../hooks/use-member";
import "./mission-auth.css";

const loginRoute = getRouteApi("/login");

export function LoginPage() {
  const { registered } = loginRoute.useSearch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const login = useLoginMutation();
  const canSubmit = Boolean(email.trim() && password);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (canSubmit && !login.isPending) login.mutate({ email: email.trim(), password });
  }

  return (
    <main className="week7-auth" aria-labelledby="login-title">
      <h1 id="login-title">로그인</h1>
      {registered && <p className="mb-4" role="status">회원가입에 성공했어요. 로그인해 주세요.</p>}
      <form onSubmit={handleSubmit}>
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
        {login.isError && <p role="alert" className="text-red-700">{getApiErrorMessage(login.error)}</p>}
        <button type="submit" disabled={!canSubmit || login.isPending}>
          {login.isPending ? "로그인 중…" : "로그인"}
        </button>
      </form>
      <Link to="/signup">회원가입</Link>
    </main>
  );
}
