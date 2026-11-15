import { Link, useNavigate } from "@tanstack/react-router";
import { useState, type SubmitEvent } from "react";
import { checkEmailDuplicate } from "../../api/members/check-email-duplicate";
import { checkNicknameDuplicate } from "../../api/members/check-nickname-duplicate";
import { signup } from "../../api/members/signup";
import { AccountField } from "../../components/account/account-field";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$/;
const DEFAULT_FORM = { email: "", nickname: "", password: "", passwordConfirm: "" };
const DEFAULT_DUPLICATE_CHECK = { isChecking: false, isAvailable: false };

type DefaultFormKey = keyof typeof DEFAULT_FORM;
type DuplicateCheckKey = "email" | "nickname";

export function SignupPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState(DEFAULT_FORM);
  const [duplicateCheck, setDuplicateCheck] = useState({
    email: DEFAULT_DUPLICATE_CHECK,
    nickname: DEFAULT_DUPLICATE_CHECK,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEmailValid = form.email.trim().length <= 254 && EMAIL_REGEX.test(form.email.trim());
  const isNicknameValid = form.nickname.trim().length >= 2 && form.nickname.trim().length <= 12;
  const isPasswordValid = form.password.length <= 72 && PASSWORD_REGEX.test(form.password);
  const isPasswordConfirmValid = form.passwordConfirm.length > 0 && form.password === form.passwordConfirm;
  const isFormValid = isEmailValid && isNicknameValid && isPasswordValid && isPasswordConfirmValid;
  const canSubmit = isFormValid && duplicateCheck.email.isAvailable && duplicateCheck.nickname.isAvailable;

  function handleChangeField(key: DefaultFormKey, value: string) {
    if (key === "email" || key === "nickname") {
      if (duplicateCheck[key].isChecking) return;
      setDuplicateCheck((prev) => ({ ...prev, [key]: DEFAULT_DUPLICATE_CHECK }));
    }
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleCheckDuplicate(key: DuplicateCheckKey) {
    const isValid = key === "email" ? isEmailValid : isNicknameValid;
    if (!isValid || isSubmitting || duplicateCheck[key].isChecking) return;

    const label = key === "email" ? "이메일" : "닉네임";
    setDuplicateCheck((prev) => ({ ...prev, [key]: { isChecking: true, isAvailable: false } }));
    try {
      const response = key === "email"
        ? await checkEmailDuplicate(form.email.trim())
        : await checkNicknameDuplicate(form.nickname.trim());
      const isAvailable = response.available === true;
      setDuplicateCheck((prev) => ({ ...prev, [key]: { ...prev[key], isAvailable } }));
      window.alert(isAvailable ? `사용할 수 있는 ${label}이에요.` : `이미 사용 중인 ${label}이에요.`);
    } catch {
      window.alert("중복 확인에 실패했어요. 다시 시도해 주세요.");
    } finally {
      setDuplicateCheck((prev) => ({ ...prev, [key]: { ...prev[key], isChecking: false } }));
    }
  }

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const response = await signup({
        email: form.email.trim(),
        nickname: form.nickname.trim(),
        password: form.password,
      });
      if (!response.isSuccess) {
        window.alert(response.message);
        return;
      }
      window.alert(response.message);
      void navigate({ to: "/login" });
    } catch {
      window.alert("회원가입에 실패했어요. 다시 시도해 주세요.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function duplicateButton(key: DuplicateCheckKey, isValid: boolean, label: string) {
    const { isChecking, isAvailable } = duplicateCheck[key];
    return (
      <button
        type="button"
        aria-label={`${label} 중복 확인`}
        disabled={!isValid || isChecking}
        onClick={() => void handleCheckDuplicate(key)}
        className="min-h-8 whitespace-nowrap rounded text-sm font-semibold text-[#2864dc] enabled:hover:underline disabled:cursor-not-allowed"
      >
        {isChecking ? "확인 중" : isAvailable ? "확인 완료" : "중복 확인"}
      </button>
    );
  }

  return (
    <main className="grid min-h-[calc(100svh-91px)] place-items-center bg-[#f4f5f7] px-5 py-10">
      <section aria-labelledby="signup-title" className="w-full max-w-[428px]">
      <h1 id="signup-title" className="mb-4 text-[32px] leading-tight font-bold tracking-tight text-[#1d1e20]">회원가입</h1>
      <form onSubmit={handleSubmit} noValidate>
        <fieldset disabled={isSubmitting} className="min-w-0 space-y-4">
          <AccountField variant="inline" label="이메일" type="email" autoComplete="email" placeholder="name@example.com"
            value={form.email} onChange={(e) => handleChangeField("email", e.target.value)}
            disabled={duplicateCheck.email.isChecking}
            error={form.email.length > 0 && !isEmailValid ? "올바른 이메일 형식으로 입력해 주세요." : undefined}
            action={duplicateButton("email", isEmailValid, "이메일")} />
          <AccountField variant="inline" label="닉네임" autoComplete="nickname" placeholder="2~12자"
            value={form.nickname} onChange={(e) => handleChangeField("nickname", e.target.value)}
            disabled={duplicateCheck.nickname.isChecking}
            error={form.nickname.length > 0 && !isNicknameValid ? "닉네임은 2~12자로 입력해 주세요." : undefined}
            action={duplicateButton("nickname", isNicknameValid, "닉네임")} />
          <AccountField variant="inline" label="비밀번호" type="password" autoComplete="new-password" placeholder="8자 이상"
            value={form.password} onChange={(e) => handleChangeField("password", e.target.value)}
            hint="영문 대소문자, 숫자, 특수문자를 모두 포함해 8자 이상 입력해 주세요."
            error={form.password.length > 0 && !isPasswordValid ? "영문 대소문자, 숫자, 특수문자(!@#$%^&*)를 포함해 8~72자로 입력해 주세요." : undefined} />
          <AccountField variant="inline" label="비밀번호 확인" type="password" autoComplete="new-password" placeholder="다시 입력"
            value={form.passwordConfirm} onChange={(e) => handleChangeField("passwordConfirm", e.target.value)}
            error={form.passwordConfirm.length > 0 && !isPasswordConfirmValid ? "비밀번호가 일치하지 않아요." : undefined} />
          <button type="submit" disabled={!canSubmit || isSubmitting}
            className="h-12 w-full rounded-lg bg-[#2563eb] text-sm font-semibold text-white enabled:hover:bg-[#1f56c7] disabled:cursor-not-allowed">
            {isSubmitting ? "가입 중" : "가입하기"}
          </button>
        </fieldset>
      </form>
      <p className="mt-4 text-center text-sm text-[#676d76]">
        이미 계정이 있나요? <Link to="/login" className="font-semibold text-[#2864dc] hover:underline">로그인</Link>
      </p>
      </section>
    </main>
  );
}
