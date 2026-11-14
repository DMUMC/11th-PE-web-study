// src/components/members/member-api-section.tsx

import { useState } from "react";
import type { FormEvent } from "react";

import {
  ApiError,
  checkEmail,
  checkNickname,
  getApiErrorMessage,
  getMemberRatings,
} from "../../api/member-api";

import type {
  CheckResponse,
  RatingResponse,
} from "../../types/member";

const inputClassName =
  "min-w-0 flex-1 rounded-lg border border-slate-300 " +
  "bg-white px-4 py-3 text-slate-900 outline-none " +
  "focus:border-blue-500 focus:ring-2 focus:ring-blue-100 " +
  "disabled:bg-slate-100";

const buttonClassName =
  "shrink-0 cursor-pointer rounded-lg bg-blue-600 " +
  "px-5 py-3 font-semibold text-white hover:bg-blue-700 " +
  "disabled:cursor-wait disabled:opacity-60";

type DuplicateCheckProps = {
  kind: "nickname" | "email";
};

// 닉네임과 이메일은 화면 구성이 같으므로 공통 컴포넌트를 사용합니다.
function DuplicateCheck({ kind }: DuplicateCheckProps) {
  const isNickname = kind === "nickname";
  const label = isNickname ? "닉네임" : "이메일";
  const inputId = `member-${kind}`;

  const [value, setValue] = useState(
    isNickname ? "수현" : "noco@umc.com",
  );

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [result, setResult] =
    useState<CheckResponse | null>(null);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const trimmedValue = value.trim();

    setResult(null);
    setMessage("");
    setErrorMessage("");

    if (!trimmedValue) {
      setErrorMessage(`${label}을 입력해 주세요.`);
      return;
    }

    setLoading(true);

    try {
      const data = isNickname
        ? await checkNickname(trimmedValue)
        : await checkEmail(trimmedValue);

      setResult(data);

      setMessage(
        data.available
          ? `사용 가능한 ${label}입니다.`
          : `이미 사용 중인 ${label}입니다.`,
      );
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6">
      <h3 className="mb-5 text-xl font-bold">
        {label} 중복 확인
      </h3>

      <form onSubmit={handleSubmit}>
        <label
          htmlFor={inputId}
          className="mb-2 block text-sm font-semibold"
        >
          {label}
        </label>

        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            id={inputId}
            type={isNickname ? "text" : "email"}
            value={value}
            disabled={loading}
            required
            placeholder={`${label}을 입력해 주세요.`}
            onChange={(event) => {
              setValue(event.target.value);

              // 입력이 바뀌면 이전 확인 결과를 지웁니다.
              setResult(null);
              setMessage("");
              setErrorMessage("");
            }}
            className={inputClassName}
          />

          <button
            type="submit"
            disabled={loading}
            className={buttonClassName}
          >
            {loading ? "확인 중..." : "중복 확인"}
          </button>
        </div>
      </form>

      <div className="mt-4" role="status" aria-live="polite">
        {loading && (
          <p className="text-sm text-slate-500">
            서버에서 확인하고 있습니다.
          </p>
        )}

        {message && (
          <p
            className={
              result?.available
                ? "font-semibold text-green-700"
                : "font-semibold text-amber-700"
            }
          >
            {message}
          </p>
        )}

        {errorMessage && (
          <p className="text-sm text-red-600">
            {errorMessage}
          </p>
        )}
      </div>

      {result !== null && (
        <div className="mt-4">
          <p className="mb-2 text-xs font-semibold text-slate-500">
            서버 응답 JSON
          </p>

          <pre className="overflow-x-auto rounded-lg bg-slate-100 p-4 text-sm text-slate-800">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </section>
  );
}

function MemberRatings() {
  const [memberId, setMemberId] = useState("1");
  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // null: 아직 조회하지 않음 / []: 조회했지만 평점 없음
  const [ratings, setRatings] =
    useState<RatingResponse[] | null>(null);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const trimmedId = memberId.trim();

    setRatings(null);
    setMessage("");
    setErrorMessage("");

    if (!/^[1-9]\d*$/.test(trimmedId)) {
      setErrorMessage("회원 ID는 1 이상의 정수로 입력하세요.");
      return;
    }

    setLoading(true);

    try {
      const data = await getMemberRatings(trimmedId);

      setRatings(data);

      setMessage(
        data.length === 0
          ? "이 회원이 작성한 평점이 없습니다."
          : `${trimmedId}번 회원의 평점 ${data.length}개를 조회했습니다.`,
      );
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        setErrorMessage(
          "존재하지 않는 회원입니다. HTTP 404",
        );
      } else {
        setErrorMessage(getApiErrorMessage(error));
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6">
      <h3 className="mb-2 text-xl font-bold">
        회원별 평점 조회
      </h3>

      <p className="mb-5 text-sm text-slate-500">
        조회할 회원의 ID를 입력해 주세요.
      </p>

      <form onSubmit={handleSubmit}>
        <label
          htmlFor="rating-member-id"
          className="mb-2 block text-sm font-semibold"
        >
          회원 ID
        </label>

        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            id="rating-member-id"
            type="number"
            min="1"
            step="1"
            value={memberId}
            disabled={loading}
            required
            onChange={(event) => {
              setMemberId(event.target.value);
              setRatings(null);
              setMessage("");
              setErrorMessage("");
            }}
            className={inputClassName}
          />

          <button
            type="submit"
            disabled={loading}
            className={buttonClassName}
          >
            {loading ? "조회 중..." : "평점 조회"}
          </button>
        </div>
      </form>

      <div className="mt-4" role="status" aria-live="polite">
        {loading && (
          <p className="text-sm text-slate-500">
            평점을 불러오고 있습니다.
          </p>
        )}

        {message && (
          <p className="font-semibold text-slate-700">
            {message}
          </p>
        )}

        {errorMessage && (
          <p className="text-sm text-red-600">
            {errorMessage}
          </p>
        )}
      </div>

      {ratings !== null && (
        <>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {ratings.map((rating) => (
              <article
                key={rating.ratingId}
                className="rounded-lg border border-slate-200 bg-slate-50 p-5"
              >
                <p className="mb-2 text-xs text-slate-500">
                  평점 번호: {rating.ratingId}
                </p>

                <h4 className="text-lg font-bold">
                  영화 ID: {rating.movieId}
                </h4>

                <p className="mt-3 font-bold text-blue-600">
                  평점 {rating.score} / 5
                </p>

                <p className="mt-3 whitespace-pre-wrap break-words leading-relaxed text-slate-700">
                  {rating.comment || "작성된 코멘트가 없습니다."}
                </p>

                <p className="mt-4 break-all text-xs text-slate-500">
                  작성일: {rating.createdAt}
                </p>

                <p className="mt-1 break-all text-xs text-slate-500">
                  수정일: {rating.updatedAt}
                </p>
              </article>
            ))}
          </div>

          <details className="mt-5">
            <summary className="cursor-pointer text-sm font-semibold text-slate-600">
              서버 응답 JSON 보기
            </summary>

            <pre className="mt-3 overflow-x-auto whitespace-pre-wrap break-words rounded-lg bg-slate-100 p-4 text-sm text-slate-800">
              {JSON.stringify(ratings, null, 2)}
            </pre>
          </details>
        </>
      )}
    </section>
  );
}

export function MemberApiSection() {
  return (
    <section
      id="member-api"
      aria-labelledby="member-api-title"
      className="mx-auto max-w-6xl scroll-mt-6 px-6 pb-16 pt-8"
    >
      <div className="mb-8 border-t border-slate-200 pt-8">
        <h2
          id="member-api-title"
          className="text-3xl font-bold"
        >
          회원 정보·평점 조회
        </h2>

        <p className="mt-3 text-slate-500">
          닉네임과 이메일의 사용 가능 여부를 확인하고,
          회원이 남긴 영화 평점을 조회할 수 있습니다.
        </p>
      </div>

      <div className="mb-6 grid gap-6 md:grid-cols-2">
        <DuplicateCheck kind="nickname" />
        <DuplicateCheck kind="email" />
      </div>

      <MemberRatings />
    </section>
  );
}