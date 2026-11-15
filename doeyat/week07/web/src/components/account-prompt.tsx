import { Link } from '@tanstack/react-router';
import { useProfileStore } from '../stores/profile-store';
export default function AccountPrompt() {
  const { loading, error, refresh } = useProfileStore();
  return <main className="mx-auto w-full max-w-[600px] flex-1 px-5 py-16 text-center">
    <h1 className="text-2xl font-bold">{loading ? '회원 정보를 불러오고 있어요' : error ? '회원 정보를 불러오지 못했어요' : '로그인하고 내 정보를 확인하세요'}</h1>
    {error && <><p role="alert" className="my-5">{error}</p><button onClick={() => void refresh()} className="min-h-11 rounded-lg border px-5">다시 시도</button></>}
    {!loading && !error && <div className="mt-6 flex justify-center gap-4"><Link to="/login" className="rounded-lg bg-primary px-5 py-3 text-white">로그인</Link><Link to="/signup" className="rounded-lg border px-5 py-3">회원가입</Link></div>}
  </main>;
}
