import { type FormEvent, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useAuthStore } from "../../stores/auth-store";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function MemberEditPage() {
  const navigate = useNavigate();
  const profile = useAuthStore((state) => state.profile);
  const updateProfile = useAuthStore((state) => state.updateProfile);
  const [nickname, setNickname] = useState(profile.nickname);
  const [email, setEmail] = useState(profile.email);
  const isValid = nickname.trim().length >= 2 && nickname.trim().length <= 12 && EMAIL_REGEX.test(email.trim());

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isValid) return;
    updateProfile({ nickname: nickname.trim(), email: email.trim() });
    void navigate({ to: "/me" });
  };

  return (
    <main className="min-h-[calc(100vh-8rem)] bg-slate-50 px-5 py-12 sm:px-8">
      <div className="mx-auto max-w-xl">
        <Link
          to="/me"
          className="inline-flex text-sm font-bold text-slate-500 transition hover:text-slate-900"
        >
          ← 내 정보로 돌아가기
        </Link>

        <section className="mt-5 rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-9">
          <h1 className="text-2xl font-black tracking-tight text-slate-950">내 정보 수정</h1>
          <p className="mt-2 text-sm text-slate-500">닉네임과 이메일을 간단히 변경할 수 있어요.</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6" noValidate>
            <label className="block text-sm font-bold text-slate-800">
              닉네임
              <input
                value={nickname}
                onChange={(event) => setNickname(event.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10"
                autoComplete="nickname"
              />
              {nickname.trim().length < 2 || nickname.trim().length > 12 ? (
                <span className="mt-2 block text-xs font-semibold text-red-500">
                  닉네임은 2~12자로 입력해 주세요.
                </span>
              ) : (
                <span className="mt-2 block text-xs text-slate-400">2~12자로 입력해 주세요.</span>
              )}
            </label>

            <label className="block text-sm font-bold text-slate-800">
              이메일
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10"
                autoComplete="email"
              />
              {!EMAIL_REGEX.test(email.trim()) && (
                <span className="mt-2 block text-xs font-semibold text-red-500">
                  이메일 형식을 확인해 주세요.
                </span>
              )}
            </label>

            <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">
              <Link
                to="/me"
                className="rounded-xl border border-slate-200 px-5 py-3 text-center text-sm font-bold text-slate-700 transition hover:bg-slate-50"
              >
                취소
              </Link>
              <button
                type="submit"
                disabled={!isValid}
                className="rounded-xl bg-brand-600 px-5 py-3 text-sm font-bold text-white transition enabled:hover:bg-brand-500 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                저장
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}
