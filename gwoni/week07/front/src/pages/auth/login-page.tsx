import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { login } from "../../api/auth/login";
import { getApiErrorMessage } from "../../api/api-client";
import { useAuthStore } from "../../stores/auth-store";

const DEFAULT_FORM = {
  email: "",
  password: "",
};

type DefaultFormKey = keyof typeof DEFAULT_FORM;

export function LoginPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [form, setForm] = useState(DEFAULT_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 서버 LoginRequest가 email, password 모두 @NotEmpty
  const canSubmit = form.email.trim().length > 0 && form.password.length > 0;

  const handleChangeField = (key: DefaultFormKey, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canSubmit || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const response = await login({
        email: form.email.trim(),
        password: form.password,
      });
      setAuth(response.result.accessToken, response.result.nickname);
      alert(response.message);
      navigate({ to: "/my" });
    } catch (error) {
      // 이메일이 없거나 비밀번호가 틀리면 401 AUTH401_1
      alert(getApiErrorMessage(error, "로그인에 실패했어요. 다시 시도해 주세요."));
    } finally {
      setIsSubmitting(false);
    }
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

        <button type="submit" className="w-full border px-2 py-1 disabled:opacity-50" disabled={!canSubmit || isSubmitting}>
          {isSubmitting ? "로그인 중" : "로그인"}
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
