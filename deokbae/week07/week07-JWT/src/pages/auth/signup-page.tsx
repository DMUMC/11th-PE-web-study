import { useState, type FormEvent } from "react";
import { checkEmailDuplicate } from "@/api/members/check-email-duplicate";
import { checkNicknameDuplicate } from "@/api/members/check-nickname-duplicate";
import { signup } from "@/api/members/signup";
import { useNavigate } from "@tanstack/react-router";
import "../../App.css";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$/;

const DEFAULT_FORM = {
  email: "",
  nickname: "",
  password: "",
  passwordConfirm: "",
};

const DEFAULT_DUPLICATE_CHECK = {
  isChecking: false,
  isAvailable: false,
};


type DefaultFormKey = keyof typeof DEFAULT_FORM;
type DefaultFormValue = (typeof DEFAULT_FORM)[DefaultFormKey];
type DuplicateCheckKey = "email" | "nickname";

const LABEL_CLASS = "mb-1.5 block text-xs font-bold text-slate-900";
const INPUT_CLASS =
  "h-10 w-full rounded-lg border border-slate-200 bg-white px-3.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none aria-[invalid=true]:border-red-500";
const ERROR_CLASS = "mt-1.5 text-[11px] text-red-500";
const CHECK_BUTTON_CLASS =
  "absolute right-3.5 top-1/2 -translate-y-1/2 text-[11px] font-bold text-blue-600 hover:underline disabled:cursor-not-allowed disabled:text-slate-400 disabled:no-underline";

export function SignupPage() {
  const [form, setForm] = useState(DEFAULT_FORM);
  const [duplicateCheck, setDuplicateCheck] = useState({
    email: DEFAULT_DUPLICATE_CHECK,
    nickname: DEFAULT_DUPLICATE_CHECK,
  });
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEmailValid = EMAIL_REGEX.test(form.email.trim());
  const isNicknameValid =
    form.nickname.trim().length >= 2 && form.nickname.trim().length <= 12;
  const isPasswordValid = PASSWORD_REGEX.test(form.password);
  const isPasswordConfirmValid =
    form.passwordConfirm.length > 0 && form.password === form.passwordConfirm;

  const showEmailError = form.email.length > 0 && !isEmailValid;
  const showNicknameError = form.nickname.length > 0 && !isNicknameValid;
  const showPasswordError = form.password.length > 0 && !isPasswordValid;
  const showPasswordConfirmError =
    form.passwordConfirm.length > 0 && !isPasswordConfirmValid;

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
      setDuplicateCheck((prev) => ({
        ...prev,
        [key]: DEFAULT_DUPLICATE_CHECK,
      }));
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

   const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  if (!canSubmit || isSubmitting) return;
  setIsSubmitting(true);
  try {
    const response = await signup({
      email: form.email.trim(),
      nickname: form.nickname.trim(),
      password: form.password,
    });
    alert(response.message);
    navigate({ to: "/login" });
  } catch {
    alert("회원가입에 실패했어요. 다시 시도해 주세요.");
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <main className="flex min-h-screen justify-center bg-slate-50 px-4 pb-24 pt-28">
      <form
        onSubmit={handleSubmit}
        noValidate
        className="w-full max-w-[316px]"
      >
        <h1 className="mb-5 text-2xl font-extrabold tracking-tight text-slate-900">
          회원가입
        </h1>

        {/* 이메일 */}
        <div className="mb-4">
          <label htmlFor="email" className={LABEL_CLASS}>
            이메일
          </label>
          <div className="relative">
            <input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={form.email}
              onChange={(e) => handleChangeField("email", e.target.value)}
              aria-invalid={showEmailError}
              className={`${INPUT_CLASS} pr-16`}
            />
            <button
              type="button"
              onClick={() => handleCheckDuplicate("email")}
              disabled={!isEmailValid || duplicateCheck.email.isChecking}
              className={CHECK_BUTTON_CLASS}
            >
              {duplicateCheck.email.isChecking
                ? "확인 중"
                : duplicateCheck.email.isAvailable
                  ? "확인 완료"
                  : "중복 확인"}
            </button>
          </div>
          {showEmailError && (
            <p role="alert" className={ERROR_CLASS}>
              올바른 이메일 형식이 아니에요.
            </p>
          )}
        </div>

        {/* 닉네임 */}
        <div className="mb-4">
          <label htmlFor="nickname" className={LABEL_CLASS}>
            닉네임
          </label>
          <div className="relative">
            <input
              id="nickname"
              type="text"
              placeholder="2~12자"
              value={form.nickname}
              onChange={(e) => handleChangeField("nickname", e.target.value)}
              aria-invalid={showNicknameError}
              className={`${INPUT_CLASS} pr-16`}
            />
            <button
              type="button"
              onClick={() => handleCheckDuplicate("nickname")}
              disabled={!isNicknameValid || duplicateCheck.nickname.isChecking}
              className={CHECK_BUTTON_CLASS}
            >
              {duplicateCheck.nickname.isChecking
                ? "확인 중"
                : duplicateCheck.nickname.isAvailable
                  ? "확인 완료"
                  : "중복 확인"}
            </button>
          </div>
          {showNicknameError && (
            <p role="alert" className={ERROR_CLASS}>
              닉네임은 2~12자로 입력해 주세요.
            </p>
          )}
        </div>

        {/* 비밀번호 */}
        <div className="mb-4">
          <label htmlFor="password" className={LABEL_CLASS}>
            비밀번호
          </label>
          <input
            id="password"
            type="password"
            placeholder="8자 이상"
            value={form.password}
            onChange={(e) => handleChangeField("password", e.target.value)}
            aria-invalid={showPasswordError}
            className={INPUT_CLASS}
          />
          <p
            role={showPasswordError ? "alert" : undefined}
            className={`mt-1.5 text-[10px] ${
              showPasswordError ? "text-red-500" : "text-slate-400"
            }`}
          >
            영문 대소문자, 숫자, 특수문자를 모두 포함해 8자 이상 입력해 주세요
          </p>
        </div>

        {/* 비밀번호 확인 */}
        <div className="mb-5">
          <label htmlFor="passwordConfirm" className={LABEL_CLASS}>
            비밀번호 확인
          </label>
          <input
            id="passwordConfirm"
            type="password"
            placeholder="다시 입력"
            value={form.passwordConfirm}
            onChange={(e) =>
              handleChangeField("passwordConfirm", e.target.value)
            }
            aria-invalid={showPasswordConfirmError}
            className={INPUT_CLASS}
          />
          {showPasswordConfirmError && (
            <p role="alert" className={ERROR_CLASS}>
              비밀번호가 일치하지 않아요.
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={!canSubmit || isSubmitting}
          className="h-10 w-full rounded-lg bg-blue-600 text-xs font-bold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
        >
          {isSubmitting ? "가입 중" : "가입하기"}
        </button>

        <p className="mt-4 text-center text-[11px] text-slate-500">
          이미 계정이 있나요?{" "}
          <a href="/login" className="font-bold text-blue-600 hover:underline">
            로그인
          </a>
        </p>
      </form>
    </main>
  );
}