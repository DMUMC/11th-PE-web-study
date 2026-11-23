import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login } from "../../api/cinema-api";
import { getApiErrorMessage } from "../../api/member-api";
import { memberKey } from "../../hooks/use-member";
import { useAuthStore } from "../../stores/auth-store";
import "./mission-auth.css";

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: login,
    onSuccess: ({ accessToken }) => {
      if (!accessToken) throw new Error("로그인 응답에 토큰이 없습니다.");
      useAuthStore.getState().setAccessToken(accessToken);
      void queryClient.invalidateQueries({ queryKey: memberKey(accessToken) });
      void navigate({ to: "/" });
    },
  });

  return (
    <section className="week7-auth" aria-labelledby="week7-login-title">
      <h1 id="week7-login-title">로그인</h1>
      <form onSubmit={(event) => {
        event.preventDefault();
        if (!mutation.isPending && email.trim() && password) {
          mutation.mutate({ email: email.trim(), password });
        }
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
        <button type="submit" disabled={mutation.isPending || !email.trim() || !password}>
          {mutation.isPending ? "로그인 중…" : "로그인"}</button>
      </form>
      {mutation.isError && <p role="alert">{getApiErrorMessage(mutation.error)}</p>}
    </section>
  );
}
