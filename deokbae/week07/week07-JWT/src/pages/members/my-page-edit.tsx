import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { checkNicknameDuplicate } from "@/api/members/check-nickname-duplicate";
import { getMyInfo } from "@/api/members/get-my-info";
import { updateMyInfo } from "@/api/members/update-my-info";
import { useAuthStore } from "@/stores/auth-store";
import "../../App.css";

const LABEL_CLASS = "mb-1.5 block text-xs font-bold text-slate-900";
const INPUT_CLASS =
  "h-10 w-full rounded-lg border border-slate-200 bg-white px-3.5 text-xs text-slate-900 focus:border-blue-600 focus:outline-none read-only:bg-slate-50 read-only:text-slate-500 aria-[invalid=true]:border-red-500";

export function MyPageEdit() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const login = useAuthStore((state) => state.login);
  const accessToken = useAuthStore((state) => state.accessToken);

  const myInfoQuery = useQuery({
    queryKey: ["members", "me"],
    queryFn: getMyInfo,
  });

  // 입력값은 사용자가 바꾸기 전까지 null (서버 값을 그대로 보여 줘요)
  const [nicknameInput, setNicknameInput] = useState<string | null>(null);
  const [duplicateCheck, setDuplicateCheck] = useState({
    isChecking: false,
    checkedNickname: null as string | null,
  });

  const updateMutation = useMutation({
    mutationFn: updateMyInfo,
    onSuccess: (response) => {
      // 내 정보 캐시와 헤더의 닉네임을 새 값으로 갱신해요
      queryClient.invalidateQueries({ queryKey: ["members", "me"] });
      if (accessToken) login(accessToken, response.result.nickname);
      alert(response.message);
      navigate({ to: "/mypage" });
    },
    onError: () => {
      alert("정보 수정에 실패했어요. 다시 시도해 주세요.");
    },
  });

  if (myInfoQuery.isPending) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center text-sm text-slate-600">
        불러오는 중...
      </main>
    );
  }

  if (myInfoQuery.isError) {
    return (
      <main
        role="alert"
        className="flex min-h-[60vh] items-center justify-center text-sm text-slate-600"
      >
        내 정보를 불러오지 못했어요.
      </main>
    );
  }

  const { nickname: currentNickname, email } = myInfoQuery.data.result;
  const nickname = nicknameInput ?? currentNickname;
  const trimmed = nickname.trim();

  const isNicknameValid = trimmed.length >= 2 && trimmed.length <= 12;
  const isChanged = trimmed !== currentNickname;
  const showNicknameError = nickname.length > 0 && !isNicknameValid;

  // 닉네임을 바꿨다면, 그 값으로 중복 확인을 통과해야 저장할 수 있어요
  const isDuplicateChecked = duplicateCheck.checkedNickname === trimmed;
  const canSave =
    isChanged &&
    isNicknameValid &&
    isDuplicateChecked &&
    !updateMutation.isPending;

  const handleCheckDuplicate = async () => {
    if (!isNicknameValid || !isChanged || duplicateCheck.isChecking) return;

    setDuplicateCheck({ isChecking: true, checkedNickname: null });
    try {
      const response = await checkNicknameDuplicate(trimmed);
      setDuplicateCheck({
        isChecking: false,
        checkedNickname: response.available ? trimmed : null,
      });
      alert(
        response.available
          ? "사용할 수 있는 닉네임이에요."
          : "이미 사용 중인 닉네임이에요.",
      );
    } catch {
      setDuplicateCheck({ isChecking: false, checkedNickname: null });
      alert("중복 확인에 실패했어요. 다시 시도해 주세요.");
    }
  };

  const handleSave = () => {
    if (!canSave) return;
    updateMutation.mutate({ nickname: trimmed });
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-12 py-8">
        {/* 제목줄 */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
              내 정보 수정
            </h1>
            <p className="mt-2 text-xs text-slate-500">
              닉네임과 프로필 이미지만 변경할 수 있어요.
            </p>
          </div>
          <button
            type="button"
            onClick={handleSave}
            disabled={!canSave}
            className="h-8 rounded-md bg-blue-600 px-4 text-xs font-bold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
          >
            {updateMutation.isPending ? "저장 중" : "변경사항 저장"}
          </button>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-12">
          {/* 프로필 이미지 (서버 API 확인 전이라 자리만) */}
          <div className="flex flex-col items-center">
            <div className="flex size-[72px] items-center justify-center rounded-full bg-slate-200">
                <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
                className="size-7 text-slate-900"
                >
                <circle cx="12" cy="8" r="4" />
                <path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7z" />
                </svg>
            </div>
            <p className="mt-2 text-xs font-bold text-slate-900">프로필 이미지</p>
            </div>

          {/* 입력 영역 */}
          <div>
            <div className="mb-4">
              <label htmlFor="nickname" className={LABEL_CLASS}>
                닉네임
              </label>
              <div className="relative">
                <input
                  id="nickname"
                  type="text"
                  value={nickname}
                  onChange={(e) => setNicknameInput(e.target.value)}
                  aria-invalid={showNicknameError}
                  className={`${INPUT_CLASS} pr-20`}
                />
                <button
                  type="button"
                  onClick={handleCheckDuplicate}
                  disabled={
                    !isNicknameValid || !isChanged || duplicateCheck.isChecking
                  }
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[11px] font-bold text-blue-600 hover:underline disabled:cursor-not-allowed disabled:text-slate-400 disabled:no-underline"
                >
                  {duplicateCheck.isChecking
                    ? "확인 중"
                    : isDuplicateChecked
                      ? "확인 완료"
                      : "중복 확인"}
                </button>
              </div>
              {showNicknameError && (
                <p role="alert" className="mt-1.5 text-[11px] text-red-500">
                  닉네임은 2~12자로 입력해 주세요.
                </p>
              )}
            </div>

            <div>
              <label htmlFor="email" className={LABEL_CLASS}>
                이메일
              </label>
              <input
                id="email"
                type="email"
                value={email}
                readOnly
                className={INPUT_CLASS}
              />
            </div>
          </div>
        </div>

        {/* 회원 탈퇴 (서버 API 확인 전이라 자리만) */}
        <div className="mt-24 flex items-center justify-between rounded-lg border border-red-300 bg-red-50 px-5 py-4">
          <div>
            <h2 className="text-xs font-bold text-red-600">회원 탈퇴</h2>
            <p className="mt-1 text-[10px] text-red-500">
              탈퇴하면 작성한 평점, 후기와 즐겨찾기가 모두 삭제되며 복구할 수
              없습니다.
            </p>
          </div>
          <button
            type="button"
            disabled
            className="h-8 rounded-md border border-red-500 bg-white px-4 text-xs font-bold text-red-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            회원 탈퇴
          </button>
        </div>

        <div className="mt-4">
          <Link to="/mypage" className="text-xs text-slate-500 hover:underline">
            ‹ 내 정보로 돌아가기
          </Link>
        </div>
      </div>
    </main>
  );
}