import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { getMyInfo } from "../../api/members/get-my-info";
import { getApiErrorMessage, getApiErrorStatus } from "../../api/api-client";
import { useAuthStore } from "../../stores/auth-store";

export function MyInfoPage() {
  const navigate = useNavigate();
  const accessToken = useAuthStore((state) => state.accessToken);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  const myInfoQuery = useQuery({
    queryKey: ["members", "me", accessToken],
    queryFn: getMyInfo,
    retry: false,
  });

  const handleLogout = () => {
    clearAuth();
    navigate({ to: "/login" });
  };

  if (myInfoQuery.isPending) {
    return <main className="mx-auto mt-10 max-w-sm p-4">내 정보를 불러오는 중이에요.</main>;
  }

  if (myInfoQuery.isError) {
    // 토큰 없음/위조/만료면 401 (AUTH401_2/3/4)
    const isUnauthorized = getApiErrorStatus(myInfoQuery.error) === 401;
    return (
      <main className="mx-auto mt-10 max-w-sm p-4">
        <p className="mb-4 text-sm text-red-600">
          {getApiErrorMessage(myInfoQuery.error, "내 정보를 불러오지 못했어요.")}
        </p>
        {isUnauthorized && (
          <Link to="/login" className="block w-full border px-2 py-1 text-center">
            로그인하러 가기
          </Link>
        )}
      </main>
    );
  }

  const myInfo = myInfoQuery.data.result;

  return (
    <main className="mx-auto mt-10 max-w-sm p-4">
      <h1 className="mb-4 text-xl font-bold">내 정보</h1>
      <form className="space-y-3">
        <div>
          <label className="block text-sm" htmlFor="my-email">이메일</label>
          <input id="my-email" className="w-full border px-2 py-1 disabled:bg-gray-100" value={myInfo.email} disabled />
        </div>
        <div>
          <label className="block text-sm" htmlFor="my-nickname">닉네임</label>
          <input id="my-nickname" className="w-full border px-2 py-1 disabled:bg-gray-100" value={myInfo.nickname} disabled />
        </div>
        <div>
          <label className="block text-sm" htmlFor="my-created-at">가입일</label>
          <input
            id="my-created-at"
            className="w-full border px-2 py-1 disabled:bg-gray-100"
            value={new Date(myInfo.createdAt).toLocaleDateString("ko-KR")}
            disabled
          />
        </div>
      </form>
      <div className="mt-4 flex gap-2">
        <Link to="/my/edit" className="flex-1 border px-2 py-1 text-center">
          내 정보 수정
        </Link>
        <button type="button" className="flex-1 border px-2 py-1" onClick={handleLogout}>
          로그아웃
        </button>
      </div>
    </main>
  );
}
