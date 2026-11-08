import { isHTTPError } from "ky";
import { useState, type FormEvent } from "react";
import {
  checkEmail,
  checkNickname,
  getMemberRatings,
} from "../api/members/get-member-data";

type ApiResult = object | object[] | null;

interface ApiCardProps {
  title: string;
  method: string;
  url: string;
  value: string;
  label: string;
  inputType?: "text" | "email" | "number";
  result: ApiResult;
  error: string | null;
  isLoading: boolean;
  onValueChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

function ApiCard({
  title,
  method,
  url,
  value,
  label,
  inputType = "text",
  result,
  error,
  isLoading,
  onValueChange,
  onSubmit,
}: ApiCardProps) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-wider text-brand-600">{method}</p>
          <h2 className="mt-2 text-xl font-black text-slate-950">{title}</h2>
          <code className="mt-2 block break-all text-xs text-slate-500">{url}</code>
        </div>
      </div>

      <form onSubmit={onSubmit} className="mt-5 flex gap-2">
        <label className="min-w-0 flex-1">
          <span className="sr-only">{label}</span>
          <input
            type={inputType}
            min={inputType === "number" ? 1 : undefined}
            required
            value={value}
            onChange={(event) => onValueChange(event.target.value)}
            placeholder={label}
            className="h-11 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10"
          />
        </label>
        <button
          type="submit"
          disabled={isLoading}
          className="rounded-lg bg-slate-950 px-4 text-sm font-bold text-white hover:bg-slate-800 disabled:cursor-wait disabled:opacity-60"
        >
          {isLoading ? "요청 중" : "API 호출"}
        </button>
      </form>

      <div className="mt-5 min-h-32 overflow-auto rounded-xl bg-slate-950 p-4 text-xs leading-6 text-slate-100">
        <pre className="whitespace-pre-wrap break-words">
          {error
            ? error
            : result
              ? JSON.stringify(result, null, 2)
              : "API 호출 결과가 여기에 표시됩니다."}
        </pre>
      </div>
    </article>
  );
}

async function getApiErrorMessage(error: unknown) {
  if (isHTTPError(error)) {
    const responseText = await error.response.text();
    return `${error.response.status} ${error.response.statusText}\n${responseText}`;
  }

  return "백엔드 서버에 연결하지 못했어요. 서버 실행과 CORS 설정을 확인해 주세요.";
}

export function ApiDemoPage() {
  const [nickname, setNickname] = useState("수현");
  const [email, setEmail] = useState("noco@umc.com");
  const [memberId, setMemberId] = useState("1");
  const [nicknameResult, setNicknameResult] = useState<ApiResult>(null);
  const [emailResult, setEmailResult] = useState<ApiResult>(null);
  const [ratingResult, setRatingResult] = useState<ApiResult>(null);
  const [nicknameError, setNicknameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [ratingError, setRatingError] = useState<string | null>(null);
  const [loadingTarget, setLoadingTarget] = useState<string | null>(null);

  async function handleNicknameSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoadingTarget("nickname");
    setNicknameError(null);

    try {
      setNicknameResult(await checkNickname(nickname.trim()));
    } catch (error) {
      setNicknameResult(null);
      setNicknameError(await getApiErrorMessage(error));
    } finally {
      setLoadingTarget(null);
    }
  }

  async function handleEmailSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoadingTarget("email");
    setEmailError(null);

    try {
      setEmailResult(await checkEmail(email.trim()));
    } catch (error) {
      setEmailResult(null);
      setEmailError(await getApiErrorMessage(error));
    } finally {
      setLoadingTarget(null);
    }
  }

  async function handleRatingSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoadingTarget("rating");
    setRatingError(null);

    try {
      setRatingResult(await getMemberRatings(Number(memberId)));
    } catch (error) {
      setRatingResult(null);
      setRatingError(await getApiErrorMessage(error));
    } finally {
      setLoadingTarget(null);
    }
  }

  return (
    <main className="min-h-[calc(100vh-8rem)] bg-slate-50">
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
        <p className="text-sm font-bold text-brand-600">Spring Boot CORS 연동</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">회원 API 확인</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
          실제 브라우저 화면에서 백엔드의 닉네임·이메일 중복 확인과 회원별 평점 조회 API를 호출합니다.
          결과 영역과 개발자 도구 Network 패널을 함께 캡처해 인증할 수 있습니다.
        </p>

        <section className="mt-8 grid gap-6 lg:grid-cols-3">
          <ApiCard
            title="닉네임 중복 확인"
            method="GET"
            url={`/members/nickname/${nickname}`}
            value={nickname}
            label="닉네임"
            result={nicknameResult}
            error={nicknameError}
            isLoading={loadingTarget === "nickname"}
            onValueChange={setNickname}
            onSubmit={handleNicknameSubmit}
          />
          <ApiCard
            title="이메일 중복 확인"
            method="GET"
            url={`/members/email/${email}`}
            value={email}
            label="이메일"
            inputType="email"
            result={emailResult}
            error={emailError}
            isLoading={loadingTarget === "email"}
            onValueChange={setEmail}
            onSubmit={handleEmailSubmit}
          />
          <ApiCard
            title="회원별 평점 조회"
            method="GET"
            url={`/members/${memberId}/ratings`}
            value={memberId}
            label="회원 ID"
            inputType="number"
            result={ratingResult}
            error={ratingError}
            isLoading={loadingTarget === "rating"}
            onValueChange={setMemberId}
            onSubmit={handleRatingSubmit}
          />
        </section>
      </div>
    </main>
  );
}
