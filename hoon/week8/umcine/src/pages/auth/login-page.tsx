import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useLoginMutation } from "../../hooks/use-login-mutation";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function LoginPage() {
  const loginMutation = useLoginMutation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const isEmailValid = EMAIL_REGEX.test(email.trim());
  const showEmailError = email.length > 0 && !isEmailValid;
  const canSubmit = isEmailValid && password.length > 0;

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canSubmit || loginMutation.isPending) return;

    loginMutation.mutate({
      email: email.trim(),
      password,
    });
  };

  return (
    <div className="flex min-h-[calc(100vh-140px)] items-center justify-center py-10 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm border border-neutral-200">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-neutral-900">로그인</h1>
          <p className="mt-2 text-sm text-neutral-500">
            UMCine 서비스 이용을 위해 로그인해 주세요.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          {/* 이메일 */}
          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-1.5">
              이메일
            </label>
            <input
              type="email"
              placeholder="example@umc.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full rounded-lg border px-3.5 py-2.5 text-sm outline-none transition focus:ring-2 ${
                showEmailError
                  ? "border-red-500 focus:ring-red-200"
                  : "border-neutral-300 focus:border-blue-500 focus:ring-blue-100"
              }`}
            />
            {showEmailError && (
              <p className="mt-1.5 text-xs text-red-500">
                올바른 이메일 형식을 입력해 주세요.
              </p>
            )}
          </div>

          {/* 비밀번호 */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm font-semibold text-neutral-700">
                비밀번호
              </label>
            </div>
            <input
              type="password"
              placeholder="비밀번호를 입력해 주세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-neutral-300 px-3.5 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* 로그인 버튼 */}
          <button
            type="submit"
            disabled={!canSubmit || loginMutation.isPending}
            className="w-full mt-6 rounded-lg bg-blue-600 py-3 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-neutral-300"
          >
            {loginMutation.isPending ? "로그인 중..." : "로그인"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-neutral-500">
          아직 회원이 아니신가요?{" "}
          <Link to="/signup" className="font-semibold text-blue-600 hover:underline">
            회원가입
          </Link>
        </div>
      </div>
    </div>
  );
}
