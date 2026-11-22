import { Link } from "@tanstack/react-router";
import { useState, type SubmitEvent } from "react";
import {
  FormField,
  InputBox,
  inputClass,
  primaryButtonClass,
} from "../../components/auth/form-field";
import { Icon } from "../../components/common/icon";
import { useLoginMutation } from "../../hooks/use-login-mutation";
import { isValidEmail } from "../../utils/members/validate-member";

export function LoginPage() {
  const loginMutation = useLoginMutation();
  const [form, setForm] = useState({ email: "", password: "" });
  const canSubmit = isValidEmail(form.email) && form.password.length > 0;

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit || loginMutation.isPending) return;

    loginMutation.mutate({
      email: form.email.trim(),
      password: form.password,
    });
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

        <button
          type="submit"
          disabled={!canSubmit || loginMutation.isPending}
          className={`mt-6 ${primaryButtonClass}`}
        >
          {loginMutation.isPending ? "로그인 중" : "로그인"}
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
