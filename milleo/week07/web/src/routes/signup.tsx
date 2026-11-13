import { createFileRoute, Link } from '@tanstack/react-router';
import { useRef, useState, type FormEvent } from 'react';
import AccountField from '../components/account-field';
import { account } from '../api/account';
import { emailError, nicknameError } from '../lib/account-validation';
export const Route = createFileRoute('/signup')({ component: SignupPage });
function SignupPage() {
  const [form, setForm] = useState({ email: '', nickname: '', password: '', confirm: '' });
  const current = useRef(form); current.current = form;
  const [checked, setChecked] = useState({ email: '', nickname: '' });
  const [checks, setChecks] = useState({ email: '', nickname: '' });
  const [submitted, setSubmitted] = useState(false);
  const [pending, setPending] = useState(false);
  const [checking, setChecking] = useState('');
  const [failure, setFailure] = useState('');
  const [success, setSuccess] = useState(false);
  const errors = { email: emailError(form.email), nickname: nicknameError(form.nickname),
    password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9\s])\S{8,}$/.test(form.password) && new TextEncoder().encode(form.password).length <= 72 ? '' : '대문자·소문자·숫자·특수문자를 포함해 8자 이상, 72바이트 이하로 입력해 주세요.',
    confirm: form.password === form.confirm && form.confirm ? '' : '비밀번호가 일치하지 않습니다.' };
  function change(field: keyof typeof form, value: string) {
    setForm(prev => ({ ...prev, [field]: value })); setFailure('');
    if(field === 'email' || field === 'nickname') { setChecked(prev => ({ ...prev, [field]: '' })); setChecks(prev => ({ ...prev, [field]: '' })); }
  }
  async function check(field: 'email' | 'nickname') {
    const value = form[field].trim();
    if(errors[field]) { setChecks(prev => ({ ...prev, [field]: errors[field] })); return; }
    setChecking(field);
    try {
      const result = await account.check(field, value);
      if(current.current[field].trim() !== value) return;
      setChecked(prev => ({ ...prev, [field]: result.available ? value : '' }));
      setChecks(prev => ({ ...prev, [field]: result.available ? '사용할 수 있습니다.' : '이미 사용 중입니다.' }));
    } catch(error) { if(current.current[field].trim() === value) setChecks(prev => ({ ...prev, [field]: (error as Error).message })); }
    finally { setChecking(''); }
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setSubmitted(true); setFailure('');
    if(Object.values(errors).some(Boolean)) return;
    if(checked.email !== form.email.trim() || checked.nickname !== form.nickname.trim()) { setFailure('이메일과 닉네임 중복 확인을 완료해 주세요.'); return; }
    setPending(true);
    try { await account.signup({ email: form.email.trim(), nickname: form.nickname.trim(), password: form.password }); setSuccess(true); setForm(prev => ({ ...prev, password: '', confirm: '' })); }
    catch(error) { setFailure((error as Error).message); }
    finally { setPending(false); }
  }
  return <main className="mx-auto w-full max-w-[540px] flex-1 px-5 py-12">
    <section className="rounded-2xl border border-[#e5e7eb] bg-white p-6 sm:p-9">
      <h1 className="mb-2 text-center text-[28px] font-bold">회원가입</h1>
      <p className="mb-7 text-center text-sm text-[#687080]">UMCine에서 좋아하는 영화를 만나보세요.</p>
      {success ? <div role="status" className="space-y-5 text-center"><p className="py-5 font-medium">회원가입이 완료되었습니다.<br />가입한 이메일로 로그인해 주세요.</p><Link to="/login" className="flex min-h-12 items-center justify-center rounded-lg bg-primary font-semibold text-white">로그인하러 가기</Link></div> : <form onSubmit={submit} noValidate className="space-y-5">
        {(['email', 'nickname'] as const).map(field => <div key={field}>
          <AccountField id={`signup-${field}`} label={field === 'email' ? '이메일' : '닉네임'} type={field === 'email' ? 'email' : 'text'} autoComplete={field === 'email' ? 'email' : 'nickname'} value={form[field]} onChange={e => change(field, e.target.value)} error={submitted ? errors[field] : ''} disabled={pending} />
          <div className="mt-2 flex items-center justify-between gap-3"><p role="status" className={`text-sm ${checked[field] ? 'text-green-800' : 'text-[#687080]'}`}>{checks[field]}</p><button type="button" onClick={() => void check(field)} disabled={!!checking || pending} className="min-h-11 shrink-0 rounded-lg border px-4 text-sm font-semibold">{checking === field ? '확인 중…' : '중복 확인'}</button></div>
        </div>)}
        <AccountField id="signup-password" label="비밀번호" type="password" autoComplete="new-password" value={form.password} onChange={e => change('password', e.target.value)} error={submitted ? errors.password : ''} hint="대문자·소문자·숫자·특수문자 포함 8자 이상" disabled={pending} />
        <AccountField id="signup-confirm" label="비밀번호 확인" type="password" autoComplete="new-password" value={form.confirm} onChange={e => change('confirm', e.target.value)} error={submitted ? errors.confirm : ''} disabled={pending} />
        {failure && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{failure}</p>}
        <button type="submit" disabled={pending} className="min-h-12 w-full rounded-lg bg-primary font-semibold text-white">{pending ? '가입 중…' : '회원가입'}</button>
        <p className="text-center text-sm text-[#687080]">이미 계정이 있으신가요? <Link to="/login" className="font-semibold text-primary">로그인</Link></p>
      </form>}
    </section>
  </main>;
}
