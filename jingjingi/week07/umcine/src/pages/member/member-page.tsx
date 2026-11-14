import { Link } from "@tanstack/react-router";
import { useAuthStore } from "../../stores/auth-store";

export function MemberPage() {
  const { isLoggedIn, profile } = useAuthStore();
  const initial = profile.nickname.trim().charAt(0) || "U";

  return (
    <main className="min-h-[calc(100vh-8rem)] bg-slate-50 px-5 py-12 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div><p className="text-sm font-bold text-brand-600">My UMCine</p><h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">내 정보</h1><p className="mt-2 text-sm text-slate-500">계정 정보와 활동 현황을 확인할 수 있어요.</p></div>
          <Link to="/me/edit" className="rounded-xl bg-brand-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-brand-500">내 정보 수정</Link>
        </div>
        {!isLoggedIn && <div className="mt-8 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-900"><p>현재는 미리보기 상태예요. 로그인하면 입력한 이메일이 반영돼요.</p><Link to="/login" className="font-black underline">로그인하기</Link></div>}
        <section className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="bg-gradient-to-r from-brand-600 to-indigo-400 px-7 py-10 sm:px-10" />
          <div className="px-7 pb-8 sm:px-10">
            <div className="-mt-10 grid size-20 place-items-center rounded-full border-4 border-white bg-slate-950 text-2xl font-black text-white shadow-md">{initial}</div>
            <h2 className="mt-5 text-2xl font-black text-slate-950">{profile.nickname}</h2><p className="mt-1 text-sm text-slate-500">UMCine 멤버</p>
            <dl className="mt-8 grid gap-4 border-t border-slate-100 pt-8 sm:grid-cols-2">
              <div className="rounded-2xl bg-slate-50 p-5"><dt className="text-xs font-bold uppercase tracking-wider text-slate-400">닉네임</dt><dd className="mt-2 font-bold text-slate-900">{profile.nickname}</dd></div>
              <div className="rounded-2xl bg-slate-50 p-5"><dt className="text-xs font-bold uppercase tracking-wider text-slate-400">이메일</dt><dd className="mt-2 break-all font-bold text-slate-900">{profile.email}</dd></div>
            </dl>
          </div>
        </section>
        <section className="mt-6 grid gap-4 sm:grid-cols-3">
          {[["북마크", "저장한 영화를 한곳에서 확인해요."], ["내 평점", "작성한 평점과 후기를 관리해요."], ["계정 보안", "로그인 정보를 안전하게 관리해요."]].map(([title, description]) => <div key={title} className="rounded-2xl border border-slate-200 bg-white p-5"><h3 className="font-black text-slate-900">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-500">{description}</p></div>)}
        </section>
      </div>
    </main>
  );
}
