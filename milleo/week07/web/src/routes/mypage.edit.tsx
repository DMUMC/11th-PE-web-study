import { createFileRoute, Link } from '@tanstack/react-router';
import { useState, type FormEvent } from 'react';
import AccountField from '../components/account-field';
import { emailError, nicknameError } from '../lib/account-validation';
import AccountPrompt from '../components/account-prompt';
import { account, AccountError, type Profile } from '../api/account';
import { useProfileStore } from '../stores/profile-store';

export const Route = createFileRoute('/mypage/edit')({ component: EditProfilePage });

function EditProfilePage() {
  const profile = useProfileStore((state) => state.profile);
  if (!profile) return <AccountPrompt />;
  return <EditForm key={profile.memberId} profile={profile} />;
}
function EditForm({ profile }: { profile: Profile }) {
  const [pending, setPending] = useState(false);
  const [failure, setFailure] = useState('');
  const updateProfile = useProfileStore((state) => state.updateProfile);
  const [draft, setDraft] = useState(() => ({ ...profile }));
  const [submitted, setSubmitted] = useState(false);
  const [saved, setSaved] = useState(false);
  const errors = { email: emailError(draft.email), nickname: nicknameError(draft.nickname), introduction: draft.introduction.length > 150 ? '소개는 150자 이하로 입력해 주세요.' : '' };
  const dirty = JSON.stringify(draft) !== JSON.stringify(profile);
  function update(field: keyof typeof draft, value: string) {
    setDraft((current) => ({ ...current, [field]: value }));
    setSaved(false);
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
    setSaved(false);
    if (Object.values(errors).some(Boolean)) return;
    const next = { ...draft, email: draft.email.trim(), nickname: draft.nickname.trim(), introduction: draft.introduction.trim() };
    setPending(true); setFailure('');
    try { const result = await account.update(next); updateProfile(result); setDraft(result); setSaved(true); }
    catch (error) { setFailure((error as Error).message); if(error instanceof AccountError && error.status === 401) updateProfile(null); }
    finally { setPending(false); }
  }
  return (
    <main className="mx-auto w-full max-w-[800px] flex-1 px-5 py-10 sm:py-14">
      <Link to="/mypage" className="mb-4 inline-flex min-h-11 items-center gap-1 text-sm text-[#687080] hover:text-primary"><img src="/icons/chevron-left.svg" alt="" className="size-4" />내 정보로 돌아가기</Link>
      <h1 className="mb-7 text-[28px] font-bold tracking-tight">내 정보 수정</h1>
      <form onSubmit={submit} noValidate className="space-y-6 rounded-2xl border border-[#e5e7eb] bg-white p-6 sm:p-10">
        <AccountField id="profile-email" label="이메일" type="email" autoComplete="email" value={draft.email} onChange={(e) => update('email', e.target.value)} error={submitted ? errors.email : ''} />
        <AccountField id="profile-nickname" label="닉네임" autoComplete="nickname" value={draft.nickname} onChange={(e) => update('nickname', e.target.value)} error={submitted ? errors.nickname : ''} hint="2~12자로 입력해 주세요." />
        <div className="space-y-2">
          <label htmlFor="profile-introduction" className="block text-sm font-semibold text-[#343840]">소개</label>
          <textarea id="profile-introduction" value={draft.introduction} onChange={(e) => update('introduction', e.target.value)} rows={3}
            aria-invalid={submitted && Boolean(errors.introduction)} aria-describedby="introduction-help"
            className="w-full resize-y rounded-lg border border-[#dce0e6] px-4 py-3 text-base leading-7" placeholder="나의 영화 취향을 소개해 주세요." />
          <p id="introduction-help" className={`text-right text-sm ${submitted && errors.introduction ? 'text-red-700' : 'text-[#687080]'}`}>{submitted && errors.introduction ? errors.introduction : `${draft.introduction.length}/150`}</p>
        </div>
        {failure && <p role="alert" className="text-sm text-red-700">{failure}</p>}
        {saved && <div role="status" className="rounded-lg bg-[#edf1ff] p-4 text-sm leading-6 text-[#2847ad]">회원 정보가 저장되었습니다. <Link to="/mypage" className="font-semibold underline underline-offset-4">내 정보에서 확인하기</Link></div>}
        <div className="flex gap-3 border-t border-[#edf0f3] pt-6">
          <Link to="/mypage" className="inline-flex min-h-12 flex-1 items-center justify-center rounded-lg border border-[#dce0e6] font-semibold hover:bg-gray-50">취소</Link>
          <button type="submit" disabled={!dirty || pending} className="min-h-12 flex-1 rounded-lg bg-primary px-5 font-semibold text-white hover:bg-[#2d4ed0]">{pending ? '저장 중…' : '저장하기'}</button>
        </div>
        <p className="text-sm leading-6 text-[#687080]">저장한 정보는 다시 로그인해도 유지됩니다.</p>
      </form>
    </main>
  );
}
