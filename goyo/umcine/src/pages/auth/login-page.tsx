
import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { login } from "../../api/members/login";

export function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const canSubmit =
    email.trim().length > 0 &&
    password.length > 0 &&
    !isSubmitting;

  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();

    if (!canSubmit) return;

    setIsSubmitting(true);
    setError("");

    try {
      const response = await login({
        email: email.trim(),
        password,
      });

      if (!response.isSuccess) {
        throw new Error(response.message);
      }

      localStorage.setItem(
        "accessToken",
        response.result.accessToken,
      );

      await navigate({ to: "/members/me" });
    } catch {
      setError("이메일 또는 비밀번호를 확인해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputStyle =
    "h-[46px] w-full rounded-md border border-[#E5E7EB] bg-white px-4 text-[13px] text-[#111827] outline-none placeholder:text-[#9CA3AF] focus:border-[#2563EB]";

  return (
    <main className="flex min-h-[calc(100vh-58px)] items-center justify-center bg-[#F7F8FA] px-4 py-12">
      <div className="w-full max-w-[400px]">
        <h1 className="mb-7 text-[28px] font-bold text-[#111827]">
          로그인
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="login-email"
              className="mb-2 block text-[13px] font-semibold"
            >
              이메일
            </label>

            <input
              id="login-email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
              className={inputStyle}
            />
          </div>

          <div>
            <label
              htmlFor="login-password"
              className="mb-2 block text-[13px] font-semibold"
            >
              비밀번호
            </label>

            <input
              id="login-password"
              type="password"
              placeholder="비밀번호 입력"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isSubmitting}
              className={inputStyle}
            />
          </div>

          {error && (
            <p className="text-[12px] text-red-500">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={!canSubmit}
            className="h-[46px] w-full rounded-md bg-[#2563EB] text-[14px] font-semibold text-white hover:bg-[#1D4ED8] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? "로그인 중" : "로그인"}
          </button>
        </form>

        <p className="mt-5 text-center text-[12px] text-[#6B7280]">
          아직 계정이 없나요?{" "}
          <Link
            to="/signup"
            className="font-semibold text-[#2563EB]"
          >
            회원가입
          </Link>
        </p>
      </div>
    </main>
  );
}
