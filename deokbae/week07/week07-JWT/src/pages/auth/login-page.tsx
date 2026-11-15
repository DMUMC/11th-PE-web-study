import { Link, useNavigate } from "@tanstack/react-router";
import { HTTPError } from "ky";
import { useState, type SubmitEvent } from "react";
import { login } from "@/api/auth/login";
import type { ApiResponse } from "@/api/api-response";
import { useAuthStore } from "@/stores/auth-store";
import "../../App.css";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const DEFAULT_FORM = {
  email: "",
  password: "",
};

type FormKey = keyof typeof DEFAULT_FORM;

const LABEL_CLASS = "mb-1.5 block text-xs font-bold text-slate-900";
const INPUT_CLASS =
  "h-10 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-3.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none aria-[invalid=true]:border-red-500";
const ICON_CLASS =
  "pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-500";
const ERROR_CLASS = "mt-1.5 text-[11px] text-red-500";

export function LoginPage() {
  const [form, setForm] = useState(DEFAULT_FORM);

  const isEmailValid = EMAIL_REGEX.test(form.email.trim());
  const isPasswordValid = form.password.length > 0;

  // 입력을 시작한 이메일에만 오류 표시
  const showEmailError = form.email.length > 0 && !isEmailValid;

  const canSubmit = isEmailValid && isPasswordValid;
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.login);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleChangeField = (key: FormKey, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

 const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
  e.preventDefault();
  if (!canSubmit || isSubmitting) return;

  setIsSubmitting(true);
  setErrorMessage(null);

  try {
    const response = await login({
      email: form.email.trim(),
      password: form.password,
    });
    setAuth(response.result.accessToken, response.result.nickname);
    navigate({ to: "/" });
  } catch (error) {
    // 서버가 보낸 실패 메시지가 있으면 그대로 보여 줘요
    if (error instanceof HTTPError) {
      const body = (await error.response
        .json()
        .catch(() => null)) as ApiResponse<null> | null;
      setErrorMessage(body?.message ?? "로그인에 실패했어요.");
    } else {
      setErrorMessage("서버에 연결하지 못했어요. 잠시 후 다시 시도해 주세요.");
    }
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <main className="flex min-h-screen justify-center bg-slate-50 px-4 pb-24 pt-44">
      <form
        onSubmit={handleSubmit}
        noValidate
        className="w-full max-w-[316px]"
      >
        <h1 className="mb-5 text-2xl font-extrabold tracking-tight text-slate-900">
          로그인
        </h1>

        {/* 이메일 */}
        <div className="mb-4">
          <label htmlFor="email" className={LABEL_CLASS}>
            이메일
          </label>
          <div className="relative">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              className={ICON_CLASS}
            >
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="m3 7 9 6 9-6" />
            </svg>
            <input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={form.email}
              onChange={(e) => handleChangeField("email", e.target.value)}
              aria-invalid={showEmailError}
              className={INPUT_CLASS}
            />
          </div>
          {showEmailError && (
            <p role="alert" className={ERROR_CLASS}>
              올바른 이메일 형식이 아니에요.
            </p>
          )}
        </div>

        {/* 비밀번호 */}
        <div className="mb-5">
          <label htmlFor="password" className={LABEL_CLASS}>
            비밀번호
          </label>
          <div className="relative">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              className={ICON_CLASS}
            >
              <rect x="5" y="11" width="14" height="10" rx="2" />
              <path d="M8 11V7a4 4 0 0 1 8 0v4" />
            </svg>
            <input
              id="password"
              type="password"
              placeholder="비밀번호"
              value={form.password}
              onChange={(e) => handleChangeField("password", e.target.value)}
              className={INPUT_CLASS}
            />
          </div>
        </div>
          {errorMessage && (
            <p role="alert" className="mb-3 text-[11px] text-red-500">
              {errorMessage}
            </p>
          )}
        <button
          type="submit"
          disabled={!canSubmit || isSubmitting}
          className="h-10 w-full rounded-lg bg-blue-600 text-xs font-bold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
        >
          {isSubmitting ? "로그인 중" : "로그인"}
        </button>

        <p className="mt-4 text-center text-[11px] text-slate-500">
          처음이신가요?{" "}
          <Link
            to="/signup"
            className="font-bold text-blue-600 hover:underline"
          >
            회원가입
          </Link>
        </p>
      </form>
    </main>
  );
}