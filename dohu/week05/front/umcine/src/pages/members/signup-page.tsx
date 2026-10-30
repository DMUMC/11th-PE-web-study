import { useState, type SubmitEvent } from "react";
import { checkEmail } from "../../api/members/check-email";
import { checkNickname } from "../../api/members/check-nickname";
import type { AvailabilityResponse } from "../../api/members/models";
import { cn } from "../../utils/cn";

type CheckStatus =
  | { type: "idle" }
  | { type: "loading" }
  | { type: "available" | "taken" | "invalid" | "error"; message: string };

interface DuplicateCheckFieldProps {
  id: string;
  label: string;
  type: "email" | "text";
  placeholder: string;
  targetName: string;
  request: (value: string) => Promise<AvailabilityResponse>;
}

// 입력값을 백엔드 중복 체크 API로 보내 사용할 수 있는지 보여 준다.
function DuplicateCheckField({
  id,
  label,
  type,
  placeholder,
  targetName,
  request,
}: DuplicateCheckFieldProps) {
  const [value, setValue] = useState("");
  const [status, setStatus] = useState<CheckStatus>({ type: "idle" });

  async function handleCheck() {
    const trimmedValue = value.trim();
    if (!trimmedValue) {
      setStatus({ type: "invalid", message: `${targetName}을 입력해 주세요.` });
      return;
    }

    setStatus({ type: "loading" });
    try {
      const { available } = await request(trimmedValue);
      setStatus(
        available
          ? { type: "available", message: `사용할 수 있는 ${targetName}이에요.` }
          : { type: "taken", message: `이미 사용 중인 ${targetName}이에요.` },
      );
    } catch {
      setStatus({
        type: "error",
        message: "중복 확인에 실패했어요. 잠시 후 다시 시도해 주세요.",
      });
    }
  }

  return (
    <div>
      <label htmlFor={id} className="text-[13px] font-bold">
        {label}
      </label>
      <div className="mt-1.5 flex h-12 items-center rounded-lg border border-line bg-white pl-4 pr-3 focus-within:border-primary">
        <input
          id={id}
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={(event) => {
            setValue(event.target.value);
            setStatus({ type: "idle" });
          }}
          className="h-full min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-ink-muted"
        />
        <button
          type="button"
          onClick={handleCheck}
          disabled={status.type === "loading"}
          className="shrink-0 text-xs font-bold text-primary disabled:text-ink-muted"
        >
          {status.type === "loading" ? "확인 중" : "중복 확인"}
        </button>
      </div>
      {"message" in status && (
        <p
          role={status.type === "available" ? "status" : "alert"}
          className={cn(
            "mt-1.5 text-xs",
            status.type === "available" ? "text-primary" : "text-danger",
          )}
        >
          {status.message}
        </p>
      )}
    </div>
  );
}

const inputClass =
  "mt-1.5 h-12 w-full rounded-lg border border-line bg-white px-4 text-sm outline-none placeholder:text-ink-muted focus:border-primary";

export function SignupPage() {
  // 회원가입 요청은 6주차에 연결한다. 이번 주차에는 중복 확인만 서버와 주고받는다.
  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  return (
    <main className="flex flex-1 items-center justify-center px-5 py-16">
      <form onSubmit={handleSubmit} className="w-full max-w-[440px]">
        <h1 className="text-[28px] font-extrabold tracking-[-0.56px]">
          회원가입
        </h1>

        <div className="mt-6 flex flex-col gap-4">
          <DuplicateCheckField
            id="email"
            label="이메일"
            type="email"
            placeholder="name@example.com"
            targetName="이메일"
            request={checkEmail}
          />
          <DuplicateCheckField
            id="nickname"
            label="닉네임"
            type="text"
            placeholder="2~12자"
            targetName="닉네임"
            request={checkNickname}
          />
          <div>
            <label htmlFor="password" className="text-[13px] font-bold">
              비밀번호
            </label>
            <input
              id="password"
              type="password"
              placeholder="8자 이상"
              autoComplete="new-password"
              className={inputClass}
            />
            <p className="mt-1.5 text-xs text-ink-muted">
              영문 대소문자, 숫자, 특수문자를 모두 포함해 8자 이상 입력해 주세요.
            </p>
          </div>
          <div>
            <label htmlFor="password-confirm" className="text-[13px] font-bold">
              비밀번호 확인
            </label>
            <input
              id="password-confirm"
              type="password"
              placeholder="다시 입력"
              autoComplete="new-password"
              className={inputClass}
            />
          </div>
        </div>

        <button
          type="submit"
          className="mt-6 h-12 w-full rounded-lg bg-primary text-sm font-bold text-white hover:bg-primary-dark"
        >
          가입하기
        </button>
        <p className="mt-4 text-center text-xs text-ink-sub">
          이미 계정이 있나요?{" "}
          <span className="font-bold text-primary">로그인</span>
        </p>
      </form>
    </main>
  );
}
