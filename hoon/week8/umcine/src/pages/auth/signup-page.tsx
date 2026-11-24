import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { checkEmailDuplicate } from "../../api/members/check-email-duplicate";
import { checkNicknameDuplicate } from "../../api/members/check-nickname-duplicate";
import { useSignupMutation } from "../../hooks/use-signup-mutation";

// 이메일 형식 검사
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// 영문 대소문자, 숫자, 특수문자(!@#$%^&*)를 모두 포함해 8자 이상
const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$/;

const DEFAULT_FORM = {
  email: "",
  nickname: "",
  password: "",
  passwordConfirm: "",
};

type DefaultFormKey = keyof typeof DEFAULT_FORM;
type DefaultFormValue = (typeof DEFAULT_FORM)[DefaultFormKey];

const DEFAULT_DUPLICATE_CHECK = {
  isChecking: false,
  isAvailable: false,
};

type DuplicateCheckKey = "email" | "nickname";

export function SignupPage() {
  const signupMutation = useSignupMutation();
  const [form, setForm] = useState(DEFAULT_FORM);
  const [duplicateCheck, setDuplicateCheck] = useState({
    email: DEFAULT_DUPLICATE_CHECK,
    nickname: DEFAULT_DUPLICATE_CHECK,
  });

  // 입력값의 유효성 검사
  const isEmailValid = EMAIL_REGEX.test(form.email.trim());
  const isNicknameValid =
    form.nickname.trim().length >= 2 && form.nickname.trim().length <= 12;
  const isPasswordValid = PASSWORD_REGEX.test(form.password);
  const isPasswordConfirmValid =
    form.passwordConfirm.length > 0 && form.password === form.passwordConfirm;

  // 입력을 시작한 필드에만 오류 표시
  const showEmailError = form.email.length > 0 && !isEmailValid;
  const showNicknameError = form.nickname.length > 0 && !isNicknameValid;
  const showPasswordError = form.password.length > 0 && !isPasswordValid;
  const showPasswordConfirmError =
    form.passwordConfirm.length > 0 && !isPasswordConfirmValid;

  // 모든 입력값이 유효한지 검사
  const isFormValid =
    isEmailValid &&
    isNicknameValid &&
    isPasswordValid &&
    isPasswordConfirmValid;

  // 입력 조건과 두 중복 확인을 모두 통과해야 제출 가능
  const canSubmit =
    isFormValid &&
    duplicateCheck.email.isAvailable &&
    duplicateCheck.nickname.isAvailable;

  const handleChangeField = (key: DefaultFormKey, value: DefaultFormValue) => {
    if (key === "email" || key === "nickname") {
      if (duplicateCheck[key].isChecking) return;
      // 확인한 값을 바꾸면 다시 중복 확인해야 함
      setDuplicateCheck((prev) => ({ ...prev, [key]: DEFAULT_DUPLICATE_CHECK }));
    }
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleCheckDuplicate = async (key: DuplicateCheckKey) => {
    const isValid = key === "email" ? isEmailValid : isNicknameValid;
    if (!isValid || duplicateCheck[key].isChecking) return;

    const label = key === "email" ? "이메일" : "닉네임";
    setDuplicateCheck((prev) => ({
      ...prev,
      [key]: { isChecking: true, isAvailable: false },
    }));

    try {
      const response =
        key === "email"
          ? await checkEmailDuplicate(form.email.trim())
          : await checkNicknameDuplicate(form.nickname.trim());
      const isAvailable = response.available;
      setDuplicateCheck((prev) => ({
        ...prev,
        [key]: { ...prev[key], isAvailable },
      }));
      alert(
        isAvailable
          ? `사용할 수 있는 ${label}이에요.`
          : `이미 사용 중인 ${label}이에요.`,
      );
    } catch {
      setDuplicateCheck((prev) => ({
        ...prev,
        [key]: { ...prev[key], isAvailable: false },
      }));
      alert("중복 확인에 실패했어요. 다시 시도해 주세요.");
    } finally {
      setDuplicateCheck((prev) => ({
        ...prev,
        [key]: { ...prev[key], isChecking: false },
      }));
    }
  };

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canSubmit || signupMutation.isPending) return;

    signupMutation.mutate({
      email: form.email.trim(),
      nickname: form.nickname.trim(),
      password: form.password,
    });
  };

  return (
    <div className="flex min-h-[calc(100vh-140px)] items-center justify-center py-10 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm border border-neutral-200">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-neutral-900">회원가입</h1>
          <p className="mt-2 text-sm text-neutral-500">
            UMCine 서비스 이용을 위해 정보를 입력해 주세요.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          {/* 이메일 */}
          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-1.5">
              이메일
            </label>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="example@umc.com"
                value={form.email}
                disabled={duplicateCheck.email.isChecking}
                onChange={(e) => handleChangeField("email", e.target.value)}
                className={`flex-1 rounded-lg border px-3.5 py-2.5 text-sm outline-none transition focus:ring-2 ${
                  showEmailError
                    ? "border-red-500 focus:ring-red-200"
                    : duplicateCheck.email.isAvailable
                    ? "border-green-500 focus:ring-green-200"
                    : "border-neutral-300 focus:border-blue-500 focus:ring-blue-100"
                }`}
              />
              <button
                type="button"
                disabled={!isEmailValid || duplicateCheck.email.isChecking}
                onClick={() => handleCheckDuplicate("email")}
                className="shrink-0 rounded-lg bg-neutral-800 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-neutral-900 disabled:cursor-not-allowed disabled:bg-neutral-300"
              >
                {duplicateCheck.email.isChecking ? "확인 중" : "중복 확인"}
              </button>
            </div>
            {showEmailError && (
              <p className="mt-1.5 text-xs text-red-500">
                올바른 이메일 형식을 입력해 주세요.
              </p>
            )}
            {duplicateCheck.email.isAvailable && !showEmailError && (
              <p className="mt-1.5 text-xs text-green-600">
                사용할 수 있는 이메일이에요.
              </p>
            )}
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
                value={form.nickname}
                disabled={duplicateCheck.nickname.isChecking}
                onChange={(e) => handleChangeField("nickname", e.target.value)}
                className={`flex-1 rounded-lg border px-3.5 py-2.5 text-sm outline-none transition focus:ring-2 ${
                  showNicknameError
                    ? "border-red-500 focus:ring-red-200"
                    : duplicateCheck.nickname.isAvailable
                    ? "border-green-500 focus:ring-green-200"
                    : "border-neutral-300 focus:border-blue-500 focus:ring-blue-100"
                }`}
              />
              <button
                type="button"
                disabled={!isNicknameValid || duplicateCheck.nickname.isChecking}
                onClick={() => handleCheckDuplicate("nickname")}
                className="shrink-0 rounded-lg bg-neutral-800 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-neutral-900 disabled:cursor-not-allowed disabled:bg-neutral-300"
              >
                {duplicateCheck.nickname.isChecking ? "확인 중" : "중복 확인"}
              </button>
            </div>
            {showNicknameError && (
              <p className="mt-1.5 text-xs text-red-500">
                닉네임은 2자 이상 12자 이하로 입력해 주세요.
              </p>
            )}
            {duplicateCheck.nickname.isAvailable && !showNicknameError && (
              <p className="mt-1.5 text-xs text-green-600">
                사용할 수 있는 닉네임이에요.
              </p>
            )}
          </div>

          {/* 비밀번호 */}
          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-1.5">
              비밀번호
            </label>
            <input
              type="password"
              placeholder="영문 대소문자, 숫자, 특수문자(!@#$%^&*) 포함 8자 이상"
              value={form.password}
              onChange={(e) => handleChangeField("password", e.target.value)}
              className={`w-full rounded-lg border px-3.5 py-2.5 text-sm outline-none transition focus:ring-2 ${
                showPasswordError
                  ? "border-red-500 focus:ring-red-200"
                  : isPasswordValid
                  ? "border-green-500 focus:ring-green-200"
                  : "border-neutral-300 focus:border-blue-500 focus:ring-blue-100"
              }`}
            />
            {showPasswordError && (
              <p className="mt-1.5 text-xs text-red-500">
                영문 대소문자, 숫자, 특수문자(!@#$%^&*)를 모두 포함해 8자 이상 입력해 주세요.
              </p>
            )}
          </div>

          {/* 비밀번호 확인 */}
          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-1.5">
              비밀번호 확인
            </label>
            <input
              type="password"
              placeholder="비밀번호를 다시 입력해 주세요"
              value={form.passwordConfirm}
              onChange={(e) => handleChangeField("passwordConfirm", e.target.value)}
              className={`w-full rounded-lg border px-3.5 py-2.5 text-sm outline-none transition focus:ring-2 ${
                showPasswordConfirmError
                  ? "border-red-500 focus:ring-red-200"
                  : isPasswordConfirmValid
                  ? "border-green-500 focus:ring-green-200"
                  : "border-neutral-300 focus:border-blue-500 focus:ring-blue-100"
              }`}
            />
            {showPasswordConfirmError && (
              <p className="mt-1.5 text-xs text-red-500">
                비밀번호가 일치하지 않아요.
              </p>
            )}
          </div>

          {/* 가입하기 버튼 */}
          <button
            type="submit"
            disabled={!canSubmit || signupMutation.isPending}
            className="w-full mt-6 rounded-lg bg-blue-600 py-3 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-neutral-300"
          >
            {signupMutation.isPending ? "가입 중..." : "가입하기"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-neutral-500">
          이미 계정이 있으신가요?{" "}
          <Link to="/login" className="font-semibold text-blue-600 hover:underline">
            로그인
          </Link>
        </div>
      </div>
    </div>
  );
}
