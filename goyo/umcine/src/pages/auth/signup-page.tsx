
import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "@tanstack/react-router";

import { checkEmailDuplicate } from "../../api/members/check-email-duplicate";
import { checkNicknameDuplicate } from "../../api/members/check-nickname-duplicate";
import { signup } from "../../api/members/signup";

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
type DuplicateCheckKey = "email" | "nickname";

export function SignupPage() {
  const [form, setForm] = useState(DEFAULT_FORM);

  const [duplicateCheck, setDuplicateCheck] = useState({
    email: { ...DEFAULT_DUPLICATE_CHECK },
    nickname: { ...DEFAULT_DUPLICATE_CHECK },
  });

  const [checkedValues, setCheckedValues] = useState({
    email: "",
    nickname: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEmailValid = EMAIL_REGEX.test(form.email.trim());

  const isNicknameValid =
    form.nickname.trim().length >= 2 &&
    form.nickname.trim().length <= 12;

  const isPasswordValid = PASSWORD_REGEX.test(form.password);

  const isPasswordConfirmValid =
    form.passwordConfirm.length > 0 &&
    form.password === form.passwordConfirm;

  const showEmailError =
    form.email.length > 0 && !isEmailValid;

  const showNicknameError =
    form.nickname.length > 0 && !isNicknameValid;

  const showPasswordError =
    form.password.length > 0 && !isPasswordValid;

  const showPasswordConfirmError =
    form.passwordConfirm.length > 0 &&
    !isPasswordConfirmValid;

  const isFormValid =
    isEmailValid &&
    isNicknameValid &&
    isPasswordValid &&
    isPasswordConfirmValid;

  const canSubmit =
    isFormValid &&
    duplicateCheck.email.isAvailable &&
    duplicateCheck.nickname.isAvailable &&
    checkedValues.email === form.email.trim() &&
    checkedValues.nickname === form.nickname.trim();

  const handleChangeField = (
    key: DefaultFormKey,
    value: string,
  ) => {
    if (isSubmitting) return;

    if (key === "email" || key === "nickname") {
      if (duplicateCheck[key].isChecking) return;

      setDuplicateCheck((prev) => ({
        ...prev,
        [key]: { ...DEFAULT_DUPLICATE_CHECK },
      }));

      setCheckedValues((prev) => ({
        ...prev,
        [key]: "",
      }));
    }

    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleCheckDuplicate = async (
    key: DuplicateCheckKey,
  ) => {
    const isValid =
      key === "email" ? isEmailValid : isNicknameValid;

    if (
      !isValid ||
      duplicateCheck[key].isChecking ||
      isSubmitting
    ) {
      return;
    }

    const label = key === "email" ? "이메일" : "닉네임";
    const value = form[key].trim();

    setDuplicateCheck((prev) => ({
      ...prev,
      [key]: {
        isChecking: true,
        isAvailable: false,
      },
    }));

    try {
      const response =
        key === "email"
          ? await checkEmailDuplicate(value)
          : await checkNicknameDuplicate(value);

      const isAvailable = response.available;

      setDuplicateCheck((prev) => ({
        ...prev,
        [key]: {
          isChecking: false,
          isAvailable,
        },
      }));

      setCheckedValues((prev) => ({
        ...prev,
        [key]: isAvailable ? value : "",
      }));

      alert(
        isAvailable
          ? `사용할 수 있는 ${label}이에요.`
          : `이미 사용 중인 ${label}이에요.`,
      );
    } catch {
      setDuplicateCheck((prev) => ({
        ...prev,
        [key]: {
          isChecking: false,
          isAvailable: false,
        },
      }));

      setCheckedValues((prev) => ({
        ...prev,
        [key]: "",
      }));

      alert("중복 확인에 실패했어요. 다시 시도해 주세요.");
    }
  };

  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();

    if (!canSubmit || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const response = await signup({
        email: form.email.trim(),
        nickname: form.nickname.trim(),
        password: form.password,
      });

      if (!response.isSuccess) {
        throw new Error(response.message);
      }

      alert(response.message);
    } catch {
      alert("회원가입에 실패했어요. 다시 시도해 주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputStyle =
    "h-[46px] w-full min-w-0 rounded-md border border-[#E5E7EB] bg-white px-4 text-[13px] text-[#111827] outline-none transition-colors placeholder:text-[#9CA3AF] focus:border-[#2563EB] disabled:cursor-not-allowed disabled:bg-[#F9FAFB]";

  const labelStyle =
    "mb-2 block text-[13px] font-semibold text-[#111827]";

  const checkButtonStyle =
    "absolute right-3 top-1/2 -translate-y-1/2 whitespace-nowrap px-2 py-1 text-[12px] font-semibold text-[#2563EB] hover:text-[#1D4ED8] disabled:cursor-not-allowed disabled:opacity-50";

  return (
    <main className="flex min-h-[calc(100vh-58px)] w-full items-center justify-center bg-[#F7F8FA] px-4 py-12">
      <div className="w-full max-w-[400px]">
        <h1 className="mb-7 text-[28px] font-bold tracking-tight text-[#111827]">
          회원가입
        </h1>

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-5">
            <label htmlFor="email" className={labelStyle}>
              이메일
            </label>

            <div className="relative w-full">
              <input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={form.email}
                disabled={
                  duplicateCheck.email.isChecking ||
                  isSubmitting
                }
                onChange={(e) =>
                  handleChangeField("email", e.target.value)
                }
                className={`${inputStyle} pr-[90px]`}
              />

              <button
                type="button"
                disabled={
                  !isEmailValid ||
                  duplicateCheck.email.isChecking ||
                  isSubmitting
                }
                onClick={() => handleCheckDuplicate("email")}
                className={checkButtonStyle}
              >
                {duplicateCheck.email.isChecking
                  ? "확인 중"
                  : "중복 확인"}
              </button>
            </div>

            {showEmailError && (
              <p className="mt-1.5 text-[11px] text-red-500">
                올바른 이메일 형식을 입력해주세요.
              </p>
            )}

            {duplicateCheck.email.isAvailable && (
              <p className="mt-1.5 text-[11px] text-green-600">
                사용 가능한 이메일입니다.
              </p>
            )}
          </div>

          <div className="mb-5">
            <label htmlFor="nickname" className={labelStyle}>
              닉네임
            </label>

            <div className="relative w-full">
              <input
                id="nickname"
                type="text"
                placeholder="2~12자"
                maxLength={12}
                value={form.nickname}
                disabled={
                  duplicateCheck.nickname.isChecking ||
                  isSubmitting
                }
                onChange={(e) =>
                  handleChangeField("nickname", e.target.value)
                }
                className={`${inputStyle} pr-[90px]`}
              />

              <button
                type="button"
                disabled={
                  !isNicknameValid ||
                  duplicateCheck.nickname.isChecking ||
                  isSubmitting
                }
                onClick={() =>
                  handleCheckDuplicate("nickname")
                }
                className={checkButtonStyle}
              >
                {duplicateCheck.nickname.isChecking
                  ? "확인 중"
                  : "중복 확인"}
              </button>
            </div>

            {showNicknameError && (
              <p className="mt-1.5 text-[11px] text-red-500">
                닉네임은 2~12자로 입력해주세요.
              </p>
            )}

            {duplicateCheck.nickname.isAvailable && (
              <p className="mt-1.5 text-[11px] text-green-600">
                사용 가능한 닉네임입니다.
              </p>
            )}
          </div>

          <div className="mb-5">
            <label htmlFor="password" className={labelStyle}>
              비밀번호
            </label>

            <input
              id="password"
              type="password"
              placeholder="8자 이상"
              value={form.password}
              disabled={isSubmitting}
              onChange={(e) =>
                handleChangeField("password", e.target.value)
              }
              className={inputStyle}
            />

            <p
              className={`mt-1.5 text-[11px] ${
                showPasswordError
                  ? "text-red-500"
                  : "text-[#9CA3AF]"
              }`}
            >
              영문 대소문자, 숫자, 특수문자를 모두 포함해
              8자 이상 입력해주세요.
            </p>
          </div>

          <div className="mb-7">
            <label
              htmlFor="passwordConfirm"
              className={labelStyle}
            >
              비밀번호 확인
            </label>

            <input
              id="passwordConfirm"
              type="password"
              placeholder="다시 입력"
              value={form.passwordConfirm}
              disabled={isSubmitting}
              onChange={(e) =>
                handleChangeField(
                  "passwordConfirm",
                  e.target.value,
                )
              }
              className={inputStyle}
            />

            {showPasswordConfirmError && (
              <p className="mt-1.5 text-[11px] text-red-500">
                비밀번호가 일치하지 않습니다.
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={!canSubmit || isSubmitting}
            className="h-[46px] w-full rounded-md bg-[#2563EB] text-[14px] font-semibold text-white transition-colors hover:bg-[#1D4ED8] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? "가입 중" : "가입하기"}
          </button>
        </form>

        <p className="mt-5 text-center text-[12px] text-[#6B7280]">
          이미 계정이 있나요?{" "}
          <Link
            to="/login"
            className="font-semibold text-[#2563EB] hover:underline"
          >
            로그인
          </Link>
        </p>
      </div>
    </main>
  );
}
