import { useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getMe } from "../../api/members/me";
import { checkNicknameDuplicate } from "../../api/members/check-nickname-duplicate";
import { useUpdateMeMutation } from "../../hooks/use-update-me-mutation";
import { useAuthStore } from "../../stores/auth-store";

export function MyEditPage() {
  const navigate = useNavigate();
  const accessToken = useAuthStore((state) => state.accessToken);
  const updateMeMutation = useUpdateMeMutation();

  const meQuery = useQuery({
    queryKey: ["members", "me"],
    queryFn: getMe,
    enabled: Boolean(accessToken),
  });

  const [nickname, setNickname] = useState("");
  const [isCheckingNickname, setIsCheckingNickname] = useState(false);
  const [isNicknameAvailable, setIsNicknameAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    if (meQuery.data?.nickname) {
      setNickname(meQuery.data.nickname);
    }
  }, [meQuery.data?.nickname]);

  const email = meQuery.data?.email || "불러오는 중...";
  const isNicknameValid = nickname.trim().length >= 2 && nickname.trim().length <= 12;
  const showNicknameError = nickname.length > 0 && !isNicknameValid;

  const handleCheckNickname = async () => {
    if (!isNicknameValid || isCheckingNickname) return;
    setIsCheckingNickname(true);
    try {
      const res = await checkNicknameDuplicate(nickname.trim());
      setIsNicknameAvailable(res.available);
      alert(
        res.available
          ? "사용 가능한 닉네임입니다."
          : "이미 다른 회원이 사용 중인 닉네임입니다.",
      );
    } catch {
      alert("닉네임 중복 확인에 실패했습니다.");
    } finally {
      setIsCheckingNickname(false);
    }
  };

  const handleNicknameChange = (val: string) => {
    setNickname(val);
    setIsNicknameAvailable(null);
  };

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = nickname.trim();
    if (!isNicknameValid || updateMeMutation.isPending) return;

    updateMeMutation.mutate(
      { nickname: trimmed },
      {
        onSuccess: () => {
          navigate({ to: "/my" });
        },
      },
    );
  };

  return (
    <div className="flex min-h-[calc(100vh-140px)] items-center justify-center py-10 px-4">
      <div className="w-full max-w-xl rounded-2xl bg-white p-8 shadow-sm border border-neutral-200">
        <div className="pb-6 border-b border-neutral-200">
          <h1 className="text-2xl font-bold text-neutral-900">내 정보 수정</h1>
          <p className="mt-1 text-sm text-neutral-500">
            프로필 정보(닉네임)를 수정할 수 있습니다.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          {/* 이메일 (수정 불가) */}
          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-1.5">
              이메일 (변경 불가)
            </label>
            <input
              type="email"
              value={email}
              disabled
              className="w-full rounded-lg border border-neutral-200 bg-neutral-100 px-3.5 py-2.5 text-sm text-neutral-500 cursor-not-allowed"
            />
          </div>

          {/* 닉네임 */}
          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-1.5">
              닉네임
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="2자 이상 12자 이하"
                value={nickname}
                onChange={(e) => handleNicknameChange(e.target.value)}
                className={`flex-1 rounded-lg border px-3.5 py-2.5 text-sm outline-none transition focus:ring-2 ${
                  showNicknameError
                    ? "border-red-500 focus:ring-red-200"
                    : isNicknameAvailable === true
                    ? "border-green-500 focus:ring-green-200"
                    : "border-neutral-300 focus:border-blue-500 focus:ring-blue-100"
                }`}
              />
              <button
                type="button"
                disabled={!isNicknameValid || isCheckingNickname}
                onClick={handleCheckNickname}
                className="shrink-0 rounded-lg bg-neutral-800 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-neutral-900 disabled:cursor-not-allowed disabled:bg-neutral-300"
              >
                {isCheckingNickname ? "확인 중" : "중복 확인"}
              </button>
            </div>
            {showNicknameError && (
              <p className="mt-1.5 text-xs text-red-500">
                닉네임은 2자 이상 12자 이하여야 해요.
              </p>
            )}
          </div>

          {/* 버튼 영역 */}
          <div className="flex justify-end gap-3 pt-4 border-t border-neutral-100">
            <button
              type="button"
              onClick={() => navigate({ to: "/my" })}
              className="rounded-lg border border-neutral-300 px-4 py-2 text-xs font-medium text-neutral-700 hover:bg-neutral-50 transition"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={!isNicknameValid || updateMeMutation.isPending}
              className="rounded-lg bg-blue-600 px-5 py-2 text-xs font-semibold text-white hover:bg-blue-700 transition disabled:cursor-not-allowed disabled:bg-neutral-300"
            >
              {updateMeMutation.isPending ? "저장 중..." : "저장"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
