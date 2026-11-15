import { Link } from "@tanstack/react-router";
import { useState, type SubmitEvent } from "react";
import { AccountField } from "../../components/account/account-field";
import { AccountPanel } from "../../components/account/account-panel";
import { useLoginMutation } from "../../hooks/use-login-mutation";
import { apiErrorMessage } from "../../api/api-response";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const loginMutation = useLoginMutation();
  const canSubmit = EMAIL_REGEX.test(email.trim()) && password.length > 0;

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (canSubmit && !loginMutation.isPending) loginMutation.mutate({ email: email.trim(), password });
  }

  return (
    <AccountPanel title="로그인" description="UMCine에 오신 것을 환영해요.">
      <form onSubmit={handleSubmit} className="space-y-5">
        <AccountField label="이메일" icon="mail" type="email" autoComplete="username" required
          placeholder="이메일을 입력해 주세요" value={email} onChange={(event) => setEmail(event.target.value)} />
        <AccountField label="비밀번호" icon="lock" type="password" autoComplete="current-password" required
          placeholder="비밀번호를 입력해 주세요" value={password} onChange={(event) => setPassword(event.target.value)} />
        <button type="submit" disabled={!canSubmit || loginMutation.isPending}
          className="h-12 w-full rounded-lg bg-[#2864dc] text-sm font-semibold text-white hover:bg-[#1f56c7] disabled:bg-[#e3e6eb] disabled:text-[#676d76]">
          {loginMutation.isPending ? "로그인 중" : "로그인"}
        </button>
        {loginMutation.isError && <p role="alert" className="text-sm text-red-700">{apiErrorMessage(loginMutation.error, "로그인에 실패했어요. 다시 시도해 주세요.")}</p>}
      </form>
      <p className="mt-6 text-center text-sm text-[#676d76]">
        아직 계정이 없나요? <Link to="/signup" className="font-semibold text-[#2864dc] hover:underline">회원가입</Link>
      </p>
    </AccountPanel>
  );
}
