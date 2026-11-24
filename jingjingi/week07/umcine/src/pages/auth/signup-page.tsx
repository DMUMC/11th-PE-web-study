import { type FormEvent, useMemo, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useAuthStore } from "../../stores/auth-store";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$/;

export function SignupPage() {
  const navigate = useNavigate();
  const signup = useAuthStore((state) => state.signup);
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const isFormValid = useMemo(() => EMAIL_REGEX.test(email.trim()) && nickname.trim().length >= 2 && nickname.trim().length <= 12 && PASSWORD_REGEX.test(password) && password === passwordConfirm, [email, nickname, password, passwordConfirm]);
  const inputClassName = "mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10";

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isFormValid) return;
    signup({ email: email.trim(), nickname: nickname.trim() });
    void navigate({ to: "/me" });
  };

  return (
    <main className="grid min-h-[calc(100vh-8rem)] place-items-center bg-slate-50 px-5 py-16">
      <section className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-10">
        <p className="text-sm font-bold text-brand-600">Join UMCine</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">회원가입</h1>
        <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
          <label className="block text-sm font-bold text-slate-800">이메일<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="name@example.com" className={inputClassName} />{email && !EMAIL_REGEX.test(email.trim()) && <span className="mt-2 block text-xs font-semibold text-red-500">이메일 형식을 확인해 주세요.</span>}</label>
          <label className="block text-sm font-bold text-slate-800">닉네임<input value={nickname} onChange={(event) => setNickname(event.target.value)} placeholder="2~12자" className={inputClassName} />{nickname && (nickname.trim().length < 2 || nickname.trim().length > 12) && <span className="mt-2 block text-xs font-semibold text-red-500">닉네임은 2~12자로 입력해 주세요.</span>}</label>
          <label className="block text-sm font-bold text-slate-800">비밀번호<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="영문 대소문자, 숫자, 특수문자 포함 8자 이상" className={inputClassName} />{password && !PASSWORD_REGEX.test(password) && <span className="mt-2 block text-xs font-semibold text-red-500">비밀번호 조건을 확인해 주세요.</span>}</label>
          <label className="block text-sm font-bold text-slate-800">비밀번호 확인<input type="password" value={passwordConfirm} onChange={(event) => setPasswordConfirm(event.target.value)} placeholder="비밀번호 재입력" className={inputClassName} />{passwordConfirm && password !== passwordConfirm && <span className="mt-2 block text-xs font-semibold text-red-500">비밀번호가 일치하지 않아요.</span>}</label>
          <button type="submit" disabled={!isFormValid} className="w-full rounded-xl bg-brand-600 px-4 py-3 font-bold text-white transition enabled:hover:bg-brand-500 disabled:cursor-not-allowed disabled:bg-slate-300">가입하기</button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-500">이미 계정이 있나요? <Link to="/login" className="font-bold text-brand-600 hover:underline">로그인</Link></p>
      </section>
    </main>
  );
}
