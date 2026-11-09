import { useState, type FormEvent } from "react";
import "./auth-pages.css";

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

export function SignupPage() {
  const [form, setForm] = useState(DEFAULT_FORM);

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

  // 모든 입력값이 유효하면 제출 버튼 활성화
  const isFormValid =
    isEmailValid &&
    isNicknameValid &&
    isPasswordValid &&
    isPasswordConfirmValid;

  const handleChangeField = (key: DefaultFormKey, value: DefaultFormValue) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <main className="auth-page">
      <form className="signup-form" onSubmit={handleSubmit} noValidate>
        <h1>회원가입</h1>

        <div className="auth-form-group">
          <label htmlFor="signup-email">이메일</label>
          <div className="auth-field">
            <input
              id="signup-email"
              type="email"
              autoComplete="email"
              placeholder="name@example.com"
              value={form.email}
              onChange={(event) => handleChangeField("email", event.target.value)}
              aria-invalid={showEmailError}
            />
            <button className="auth-text-button" type="button">
              중복 확인
            </button>
          </div>
          {showEmailError && (
            <p className="auth-error">올바른 이메일 주소를 입력해 주세요.</p>
          )}
        </div>

        <div className="auth-form-group">
          <label htmlFor="signup-nickname">닉네임</label>
          <div className="auth-field">
            <input
              id="signup-nickname"
              type="text"
              autoComplete="nickname"
              placeholder="2–12자"
              value={form.nickname}
              onChange={(event) =>
                handleChangeField("nickname", event.target.value)
              }
              aria-invalid={showNicknameError}
            />
            <button className="auth-text-button" type="button">
              중복 확인
            </button>
          </div>
          {showNicknameError && (
            <p className="auth-error">닉네임은 2자 이상 12자 이하로 입력해 주세요.</p>
          )}
        </div>

        <div className="auth-form-group">
          <label htmlFor="signup-password">비밀번호</label>
          <div className="auth-field">
            <input
              id="signup-password"
              type="password"
              autoComplete="new-password"
              placeholder="8자 이상"
              value={form.password}
              onChange={(event) =>
                handleChangeField("password", event.target.value)
              }
              aria-invalid={showPasswordError}
              aria-describedby="signup-password-help"
            />
          </div>
          <p
            id="signup-password-help"
            className={showPasswordError ? "auth-error" : "auth-hint"}
          >
            영문 대·소문자, 숫자, 특수문자를 모두 포함해 8자 이상 입력해 주세요.
          </p>
        </div>

        <div className="auth-form-group">
          <label htmlFor="signup-password-confirm">비밀번호 확인</label>
          <div className="auth-field">
            <input
              id="signup-password-confirm"
              type="password"
              autoComplete="new-password"
              placeholder="다시 입력"
              value={form.passwordConfirm}
              onChange={(event) =>
                handleChangeField("passwordConfirm", event.target.value)
              }
              aria-invalid={showPasswordConfirmError}
            />
          </div>
          {showPasswordConfirmError && (
            <p className="auth-error">비밀번호가 일치하지 않습니다.</p>
          )}
        </div>

        <button className="auth-primary-button" type="submit" disabled={!isFormValid}>
          가입하기
        </button>
        <p className="auth-footer">
          이미 계정이 있나요? <button type="button">로그인</button>
        </p>
      </form>
    </main>
  );
}