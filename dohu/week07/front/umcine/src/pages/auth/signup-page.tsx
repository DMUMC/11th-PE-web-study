import { Link, useNavigate } from "@tanstack/react-router";
import { useState, type SubmitEvent } from "react";
import { checkEmail } from "../../api/members/check-email";
import { checkNickname } from "../../api/members/check-nickname";
import { signup } from "../../api/members/signup";
import {
  FormField,
  InputBox,
  inlineButtonClass,
  inputClass,
  primaryButtonClass,
} from "../../components/auth/form-field";
import { cn } from "../../utils/cn";
import {
  isValidEmail,
  isValidNickname,
  isValidPassword,
} from "../../utils/members/validate-member";

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

type FormKey = keyof typeof DEFAULT_FORM;
type DuplicateCheckKey = "email" | "nickname";

const DUPLICATE_LABEL: Record<DuplicateCheckKey, string> = {
  email: "이메일",
  nickname: "닉네임",
};

export function SignupPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState(DEFAULT_FORM);
  const [duplicateCheck, setDuplicateCheck] = useState({
    email: DEFAULT_DUPLICATE_CHECK,
    nickname: DEFAULT_DUPLICATE_CHECK,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEmailValid = isValidEmail(form.email);
  const isNicknameValid = isValidNickname(form.nickname);
  const isPasswordValid = isValidPassword(form.password);
  const isPasswordConfirmValid =
    form.passwordConfirm.length > 0 && form.password === form.passwordConfirm;

  // 입력을 시작한 필드에만 오류를 보여 준다.
  const emailError =
    form.email.length > 0 && !isEmailValid ? "올바른 이메일 형식이 아니에요." : null;
  const nicknameError =
    form.nickname.length > 0 && !isNicknameValid
      ? "닉네임은 2자 이상 12자 이하로 입력해 주세요."
      : null;
  const passwordError =
    form.password.length > 0 && !isPasswordValid
      ? "영문 대소문자, 숫자, 특수문자를 모두 포함해 8자 이상 입력해 주세요."
      : null;
  const passwordConfirmError =
    form.passwordConfirm.length > 0 && !isPasswordConfirmValid
      ? "비밀번호가 일치하지 않아요."
      : null;

  const isFormValid =
    isEmailValid && isNicknameValid && isPasswordValid && isPasswordConfirmValid;
  // 입력 조건과 두 중복 확인을 모두 통과해야 가입할 수 있다.
  const canSubmit =
    isFormValid &&
    duplicateCheck.email.isAvailable &&
    duplicateCheck.nickname.isAvailable;

  function handleChangeField(key: FormKey, value: string) {
    if (key === "email" || key === "nickname") {
      if (duplicateCheck[key].isChecking) return;
      // 확인한 값을 바꾸면 다시 확인해야 한다.
      setDuplicateCheck((prev) => ({ ...prev, [key]: DEFAULT_DUPLICATE_CHECK }));
    }
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleCheckDuplicate(key: DuplicateCheckKey) {
    const isValid = key === "email" ? isEmailValid : isNicknameValid;
    if (!isValid || duplicateCheck[key].isChecking) return;

    const label = DUPLICATE_LABEL[key];
    setDuplicateCheck((prev) => ({
      ...prev,
      [key]: { isChecking: true, isAvailable: false },
    }));

    try {
      const { available } =
        key === "email"
          ? await checkEmail(form.email.trim())
          : await checkNickname(form.nickname.trim());
      setDuplicateCheck((prev) => ({
        ...prev,
        [key]: { ...prev[key], isAvailable: available },
      }));
      alert(available ? `사용할 수 있는 ${label}이에요.` : `이미 사용 중인 ${label}이에요.`);
    } catch {
      alert("중복 확인에 실패했어요. 다시 시도해 주세요.");
    } finally {
      setDuplicateCheck((prev) => ({
        ...prev,
        [key]: { ...prev[key], isChecking: false },
      }));
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
      alert(response.message);
      navigate({ to: "/login" });
    } catch {
      // 실패하면 입력값을 그대로 두어 다시 요청할 수 있게 한다.
      alert("회원가입에 실패했어요. 다시 시도해 주세요.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function renderDuplicateButton(key: DuplicateCheckKey, isValid: boolean) {
    const { isChecking, isAvailable } = duplicateCheck[key];
    return (
      <button
        type="button"
        disabled={!isValid || isChecking || isAvailable}
        onClick={() => handleCheckDuplicate(key)}
        className={cn(inlineButtonClass, isAvailable && "disabled:text-primary")}
      >
        {isChecking ? "확인 중" : isAvailable ? "확인 완료" : "중복 확인"}
      </button>
    );
  }

  return (
    <main className="flex flex-1 items-center justify-center px-5 py-16">
      {/* noValidate로 브라우저 기본 검증 대신 직접 만든 검증을 쓴다. */}
      <form onSubmit={handleSubmit} noValidate className="w-full max-w-[440px]">
        <h1 className="text-[28px] font-extrabold tracking-[-0.56px]">회원가입</h1>

        <div className="mt-6 flex flex-col gap-4">
          <FormField id="email" label="이메일" error={emailError}>
            <InputBox invalid={Boolean(emailError)}>
              <input
                id="email"
                type="email"
                placeholder="name@example.com"
                autoComplete="email"
                value={form.email}
                disabled={duplicateCheck.email.isChecking}
                onChange={(event) => handleChangeField("email", event.target.value)}
                className={inputClass}
              />
              {renderDuplicateButton("email", isEmailValid)}
            </InputBox>
          </FormField>

          <FormField id="nickname" label="닉네임" error={nicknameError}>
            <InputBox invalid={Boolean(nicknameError)}>
              <input
                id="nickname"
                type="text"
                placeholder="2~12자"
                value={form.nickname}
                disabled={duplicateCheck.nickname.isChecking}
                onChange={(event) => handleChangeField("nickname", event.target.value)}
                className={inputClass}
              />
              {renderDuplicateButton("nickname", isNicknameValid)}
            </InputBox>
          </FormField>

          <FormField
            id="password"
            label="비밀번호"
            error={passwordError}
            hint="영문 대소문자, 숫자, 특수문자를 모두 포함해 8자 이상 입력해 주세요."
          >
            <InputBox invalid={Boolean(passwordError)}>
              <input
                id="password"
                type="password"
                placeholder="8자 이상"
                autoComplete="new-password"
                value={form.password}
                onChange={(event) => handleChangeField("password", event.target.value)}
                className={inputClass}
              />
            </InputBox>
          </FormField>

          <FormField id="password-confirm" label="비밀번호 확인" error={passwordConfirmError}>
            <InputBox invalid={Boolean(passwordConfirmError)}>
              <input
                id="password-confirm"
                type="password"
                placeholder="다시 입력"
                autoComplete="new-password"
                value={form.passwordConfirm}
                onChange={(event) =>
                  handleChangeField("passwordConfirm", event.target.value)
                }
                className={inputClass}
              />
            </InputBox>
          </FormField>
        </div>

        <button
          type="submit"
          disabled={!canSubmit || isSubmitting}
          className={`mt-6 ${primaryButtonClass}`}
        >
          {isSubmitting ? "가입 중" : "가입하기"}
        </button>
        <p className="mt-4 text-center text-xs text-ink-sub">
          이미 계정이 있나요?{" "}
          <Link to="/login" className="font-bold text-primary">
            로그인
          </Link>
        </p>
      </form>
    </main>
  );
}
