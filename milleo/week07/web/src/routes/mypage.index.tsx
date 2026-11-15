import { createFileRoute, Link } from '@tanstack/react-router';
import AccountPrompt from '../components/account-prompt';
import { useProfileStore } from '../stores/profile-store';

export const Route = createFileRoute('/mypage/')({ component: ProfilePage });

function ProfilePage() {
  const profile = useProfileStore((state) => state.profile);
  if (!profile) return <AccountPrompt />;
  return (
    <main className="mx-auto w-full max-w-[800px] flex-1 px-5 py-10 sm:py-14">
      <div className="mb-7 flex items-center justify-between gap-4">
        <h1 className="text-[28px] font-bold tracking-tight">내 정보</h1>
        <Link to="/mypage/edit" className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-[#dce0e6] bg-white px-4 text-sm font-semibold hover:bg-gray-50">
          <img src="/icons/edit.svg" alt="" className="size-4" />정보 수정
        </Link>
      </div>
      <section className="overflow-hidden rounded-2xl border border-[#e5e7eb] bg-white" aria-label="회원 정보">
        <div className="flex flex-col items-center gap-4 border-b border-[#edf0f3] px-7 py-9 sm:flex-row sm:gap-6 sm:px-10">
          <div className="grid size-20 shrink-0 place-items-center rounded-full bg-[#edf1ff]">
            <img src="/icons/person.svg" alt="" className="size-10" />
          </div>
          <div className="min-w-0 text-center sm:text-left">
            <h2 className="break-words text-2xl font-bold">{profile.nickname}</h2>
            <p className="mt-2 break-words text-sm text-[#687080]">{profile.introduction || '아직 소개가 없습니다.'}</p>
          </div>
        </div>
        <dl className="divide-y divide-[#edf0f3] px-7 sm:px-10">
          <div className="grid gap-2 py-6 sm:grid-cols-[120px_1fr]"><dt className="text-sm text-[#687080]">이메일</dt><dd className="break-all font-medium">{profile.email}</dd></div>
          <div className="grid gap-2 py-6 sm:grid-cols-[120px_1fr]"><dt className="text-sm text-[#687080]">닉네임</dt><dd className="break-words font-medium">{profile.nickname}</dd></div>
          <div className="grid gap-2 py-6 sm:grid-cols-[120px_1fr]"><dt className="text-sm text-[#687080]">소개</dt><dd className="whitespace-pre-wrap break-words leading-7">{profile.introduction || '아직 소개가 없습니다.'}</dd></div>
        </dl>
      </section>
      <p className="mt-5 text-sm leading-6 text-[#687080]">회원 정보는 가입한 계정과 연결되어 있습니다.</p>
    </main>
  );
}
