import { Link, useNavigate } from "@tanstack/react-router";
import { AccountPanel } from "../../components/account/account-panel";
import { useMeQuery } from "../../hooks/use-me-query";
import { useAuthStore } from "../../stores/auth-store";
import { FavoriteMovies } from "../../components/account/favorite-movies";

export function ProfilePage() {
  const navigate = useNavigate();
  const me = useMeQuery();

  return (
    <AccountPanel title="내 정보" description="내 프로필 정보를 확인해 보세요.">
      <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full bg-[#f0f5ff]">
        <img className="size-8" src="/icons/movie-icons/person.svg" alt="" />
      </div>
      {me.isPending ? <p role="status" className="text-sm">내 정보를 불러오는 중이에요.</p> : me.isError ? (
        <p role="alert" className="text-sm">내 정보를 불러오지 못했어요.{" "}
          <button type="button" onClick={() => void me.refetch()} className="text-[#2864dc] underline">다시 시도</button>
        </p>
      ) : <>
      <dl className="divide-y divide-[#e3e6eb] rounded-xl border border-[#e3e6eb] px-4 text-sm">
        <div className="flex flex-wrap justify-between gap-2 py-4">
          <dt className="font-semibold">이메일</dt><dd className="break-all text-[#676d76]">{me.data.email}</dd>
        </div>
        <div className="flex flex-wrap justify-between gap-2 py-4">
          <dt className="font-semibold">닉네임</dt><dd className="break-all text-[#676d76]">{me.data.nickname}</dd>
        </div>
        <div className="flex flex-wrap justify-between gap-2 py-4">
          <dt className="font-semibold">가입일</dt><dd className="text-[#676d76]">{me.data.createdAt.slice(0, 10)}</dd>
        </div>
      </dl>
      <Link to="/mypage/edit" className="mt-6 flex h-12 items-center justify-center gap-2 rounded-lg bg-[#2864dc] text-sm font-semibold text-white hover:bg-[#1f56c7]">
        <img className="size-4 brightness-0 invert" src="/icons/movie-icons/edit.svg" alt="" />
        내 정보 수정
      </Link>
      </>}
      <FavoriteMovies />
      <button type="button" className="mt-6 text-sm text-[#676d76] underline" onClick={() => {
        useAuthStore.getState().setAccessToken(null);
        void navigate({ to: "/", replace: true });
      }}>로그아웃</button>
    </AccountPanel>
  );
}
