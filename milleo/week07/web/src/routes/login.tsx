import { createFileRoute, Link } from '@tanstack/react-router';
import { useState, type FormEvent } from 'react';
import AccountField from '../components/account-field';
import { account } from '../api/account';
import { useProfileStore } from '../stores/profile-store';
import { emailError } from '../lib/account-validation';

export const Route = createFileRoute('/login')({ component: LoginPage });

function LoginPage() {
  const navigate = Route.useNavigate();
  const [pending, setPending] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [notice, setNotice] = useState('');
  const errors = { email: emailError(email), password: password ? '' : '비밀번호를 입력해 주세요.' };

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
    setNotice('');
    if (errors.email || errors.password) return;
    setPending(true);
    try { useProfileStore.getState().updateProfile(await account.login(email, password)); await navigate({ to: '/mypage' }); }
    catch (error) { setNotice((error as Error).message); }
    finally { setPending(false); }
  }

  return (
    <main className="flex w-full flex-1 items-start justify-center px-5 py-12 sm:py-16">
      <section className="w-full max-w-[440px] rounded-2xl border border-[#e5e7eb] bg-white px-6 py-9 sm:px-10 sm:py-11" aria-labelledby="login-title">
        <div className="mb-8 text-center">
          <span className="mb-4 inline-grid size-12 place-items-center rounded-xl bg-[#edf1ff]">
            <img src="/icons/movie.svg" alt="" className="size-7" />
          </span>
          <h1 id="login-title" className="text-[28px] font-bold tracking-tight">로그인</h1>
          <p className="mt-2 text-sm text-[#687080]">UMCine에서 나만의 영화 이야기를 시작하세요.</p>
        </div>
        <form onSubmit={submit} noValidate className="space-y-5">
          <AccountField id="login-email" label="이메일" type="email" autoComplete="email" placeholder="이메일을 입력해 주세요"
            value={email} onChange={(e) => { setEmail(e.target.value); setNotice(''); }} error={submitted ? errors.email : ''} />
          <div>
            <AccountField id="login-password" label="비밀번호" type={showPassword ? 'text' : 'password'} autoComplete="current-password"
              placeholder="비밀번호를 입력해 주세요" value={password} onChange={(e) => { setPassword(e.target.value); setNotice(''); }}
              error={submitted ? errors.password : ''} />
            <label className="mt-2 flex min-h-11 cursor-pointer items-center gap-2 text-sm text-[#687080]">
              <input type="checkbox" checked={showPassword} onChange={(e) => setShowPassword(e.target.checked)} className="size-4 accent-primary" />비밀번호 표시
            </label>
          </div>
          <button className="min-h-12 w-full rounded-lg bg-primary px-4 font-semibold text-white transition-colors hover:bg-[#2d4ed0]" type="submit" disabled={pending}>{pending ? '로그인 중…' : '로그인'}</button>
          {notice && <p role="status" className="rounded-lg bg-[#edf1ff] p-3 text-sm leading-6 text-[#2847ad]">{notice}</p>}
        </form>
        <div className="mt-7 border-t border-[#edf0f3] pt-5 text-center">
          <Link to="/signup" className="inline-flex min-h-11 items-center text-sm font-semibold text-primary hover:underline">계정이 없으신가요? 회원가입</Link>
        </div>
      </section>
    </main>
  );
}
