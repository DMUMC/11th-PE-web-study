import { Link } from "@tanstack/react-router";
import { useState, type SubmitEvent } from "react";
import {
  FormField,
  InputBox,
  inputClass,
  primaryButtonClass,
} from "../../components/auth/form-field";
import { Icon } from "../../components/common/icon";

// 이번 주차는 화면만 만든다. 로그인 API 연결은 8주차에 한다.
export function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const canSubmit = form.email.trim().length > 0 && form.password.length > 0;

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  return (
    <main className="flex flex-1 items-center justify-center px-5 py-16">
      <form onSubmit={handleSubmit} noValidate className="w-full max-w-[440px]">
        <h1 className="text-[28px] font-extrabold tracking-[-0.56px]">로그인</h1>

        <div className="mt-6 flex flex-col gap-4">
          <FormField id="login-email" label="이메일">
            <InputBox>
              <Icon name="mail" className="size-5 text-ink-muted" />
              <input
                id="login-email"
                type="email"
                placeholder="name@example.com"
                autoComplete="email"
                value={form.email}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, email: event.target.value }))
                }
                className={inputClass}
              />
            </InputBox>
          </FormField>

          <FormField id="login-password" label="비밀번호">
            <InputBox>
              <Icon name="lock" className="size-5 text-ink-muted" />
              <input
                id="login-password"
                type="password"
                placeholder="비밀번호"
                autoComplete="current-password"
                value={form.password}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, password: event.target.value }))
                }
                className={inputClass}
              />
            </InputBox>
          </FormField>
        </div>

        <button type="submit" disabled={!canSubmit} className={`mt-6 ${primaryButtonClass}`}>
          로그인
        </button>
        <p className="mt-4 text-center text-xs text-ink-sub">
          처음이신가요?{" "}
          <Link to="/signup" className="font-bold text-primary">
            회원가입
          </Link>
        </p>
      </form>
    </main>
  );
}
