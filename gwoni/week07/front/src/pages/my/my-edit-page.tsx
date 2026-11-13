import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { getMyInfo } from "../../api/members/get-my-info";
import { updateMyInfo } from "../../api/members/update-my-info";
import { getApiErrorMessage, getApiErrorStatus } from "../../api/api-client";
import { useAuthStore } from "../../stores/auth-store";

export function MyEditPage() {
  const accessToken = useAuthStore((state) => state.accessToken);

  const myInfoQuery = useQuery({
    queryKey: ["members", "me", accessToken],
    queryFn: getMyInfo,
    retry: false,
  });

  if (myInfoQuery.isPending) {
    return <main className="mx-auto mt-10 max-w-sm p-4">내 정보를 불러오는 중이에요.</main>;
  }

  if (myInfoQuery.isError) {
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

  return (
    <MyEditForm
      email={myInfoQuery.data.result.email}
      initialNickname={myInfoQuery.data.result.nickname}
    />
  );
}

interface MyEditFormProps {
  email: string;
  initialNickname: string;
}

function MyEditForm({ email, initialNickname }: MyEditFormProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const setNickname = useAuthStore((state) => state.setNickname);
  const [nickname, setNicknameInput] = useState(initialNickname);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 회원가입과 같은 닉네임 조건 (2자 이상 12자 이하)
  const trimmedNickname = nickname.trim();
  const isNicknameValid = trimmedNickname.length >= 2 && trimmedNickname.length <= 12;
  const showNicknameError = nickname.length > 0 && !isNicknameValid;
  const isChanged = trimmedNickname !== initialNickname;
  const canSubmit = isNicknameValid && isChanged;

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canSubmit || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const response = await updateMyInfo({ nickname: trimmedNickname });
      setNickname(response.result.nickname);
      await queryClient.invalidateQueries({ queryKey: ["members", "me"] });
      alert(response.message);
      navigate({ to: "/my" });
    } catch (error) {
      // 다른 회원이 쓰는 닉네임이면 409 MEMBER409_1
      alert(getApiErrorMessage(error, "내 정보 수정에 실패했어요. 다시 시도해 주세요."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="mx-auto mt-10 max-w-sm p-4">
      <h1 className="mb-4 text-xl font-bold">내 정보 수정</h1>
      <form className="space-y-3" onSubmit={handleSubmit} noValidate>
        <div>
          <label className="block text-sm" htmlFor="my-edit-email">이메일</label>
          <input id="my-edit-email" type="email" className="w-full border px-2 py-1 disabled:bg-gray-100" value={email} disabled />
        </div>

        <div>
          <label className="block text-sm" htmlFor="my-edit-nickname">닉네임</label>
          <input
            id="my-edit-nickname"
            className="w-full border px-2 py-1 disabled:bg-gray-100"
            type="text"
            value={nickname}
            onChange={(e) => setNicknameInput(e.target.value)}
          />
          {showNicknameError && (
            <p className="mt-1 text-xs text-red-600">닉네임은 2자 이상 12자 이하로 입력해 주세요.</p>
          )}
        </div>

        <button type="submit" className="w-full border px-2 py-1 disabled:opacity-50" disabled={!canSubmit || isSubmitting}>
          {isSubmitting ? "저장 중" : "저장하기"}
        </button>
      </form>
      <Link to="/my" className="mt-3 block text-sm underline">
        취소
      </Link>
    </main>
  );
}
