import { type FormEvent, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useAuthStore } from "../../stores/auth-store";

export function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim() || !password) {
      setErrorMessage("이메일과 비밀번호를 모두 입력해 주세요.");
      return;
    }
    login(email.trim());
    void navigate({ to: "/me" });
  };

  return (
    <main className="grid min-h-[calc(100vh-8rem)] place-items-center bg-slate-50 px-5 py-16">
      <section className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-10">
        <p className="text-sm font-bold text-brand-600">Welcome back</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">로그인</h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">이메일과 비밀번호를 입력해 UMCine을 계속 이용하세요.</p>
        <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
          <label className="block text-sm font-bold text-slate-800">
            이메일
            <input type="email" value={email} onChange={(event) => { setEmail(event.target.value); setErrorMessage(""); }} placeholder="name@example.com" autoComplete="email" className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10" />
          </label>
          <label className="block text-sm font-bold text-slate-800">
            비밀번호
            <input type="password" value={password} onChange={(event) => { setPassword(event.target.value); setErrorMessage(""); }} placeholder="비밀번호 입력" autoComplete="current-password" className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10" />
          </label>
          {errorMessage && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">{errorMessage}</p>}
          <button type="submit" className="w-full rounded-xl bg-brand-600 px-4 py-3 font-bold text-white transition hover:bg-brand-500">로그인</button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-500">아직 계정이 없나요? <Link to="/signup" className="font-bold text-brand-600 hover:underline">회원가입</Link></p>
      </section>
    </main>
  );
}
