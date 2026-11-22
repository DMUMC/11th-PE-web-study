import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useLoginMutation } from "../../hooks/use-login-mutation";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const DEFAULT_FORM = {
  email: "",
  password: "",
};

type DefaultFormKey = keyof typeof DEFAULT_FORM;

export function LoginPage() {
  const [form, setForm] = useState(DEFAULT_FORM);
  const loginMutation = useLoginMutation();

  const canSubmit = EMAIL_REGEX.test(form.email.trim()) && form.password.length > 0;

  const handleChangeField = (key: DefaultFormKey, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canSubmit || loginMutation.isPending) return;

    loginMutation.mutate({
      email: form.email.trim(),
      password: form.password,
    });
  };

  return (
    <main className="mx-auto mt-10 max-w-sm p-4">
      <h1 className="mb-4 text-xl font-bold">로그인</h1>
      <form className="space-y-3" onSubmit={handleSubmit} noValidate>
        <div>
          <label className="block text-sm" htmlFor="login-email">이메일</label>
          <input
            id="login-email"
            className="w-full border px-2 py-1 disabled:bg-gray-100"
            type="email"
            value={form.email}
            onChange={(e) => handleChangeField("email", e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm" htmlFor="login-password">비밀번호</label>
          <input
            id="login-password"
            className="w-full border px-2 py-1 disabled:bg-gray-100"
            type="password"
            value={form.password}
            onChange={(e) => handleChangeField("password", e.target.value)}
          />
        </div>

        <button type="submit" className="w-full border px-2 py-1 disabled:opacity-50" disabled={!canSubmit || loginMutation.isPending}>
          {loginMutation.isPending ? "로그인 중" : "로그인"}
        </button>
      </form>
      <p className="mt-3 text-sm">
        아직 회원이 아니신가요?{" "}
        <Link to="/signup" className="underline">
          회원가입
        </Link>
      </p>
    </main>
  );
}
