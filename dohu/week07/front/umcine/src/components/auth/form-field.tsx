import type { ReactNode } from "react";
import { cn } from "../../utils/cn";

interface FormFieldProps {
  id: string;
  label: string;
  error?: string | null;
  hint?: string;
  children: ReactNode;
}

// 라벨, 입력칸, 안내나 오류 문구를 같은 간격으로 묶는다. 오류가 있으면 안내 대신 오류를 보여 준다.
export function FormField({ id, label, error, hint, children }: FormFieldProps) {
  const message = error ?? hint;

  return (
    <div>
      <label htmlFor={id} className="text-[13px] font-bold">
        {label}
      </label>
      <div className="mt-1.5">{children}</div>
      {message && (
        <p
          id={`${id}-message`}
          role={error ? "alert" : undefined}
          className={cn("mt-1.5 text-xs", error ? "text-danger" : "text-ink-muted")}
        >
          {message}
        </p>
      )}
    </div>
  );
}

interface InputBoxProps {
  invalid?: boolean;
  disabled?: boolean;
  children: ReactNode;
}

// 입력칸 테두리 상자다. 안쪽에 아이콘이나 버튼을 함께 둘 수 있다.
export function InputBox({ invalid, disabled, children }: InputBoxProps) {
  return (
    <div
      className={cn(
        "flex h-12 items-center gap-2 rounded-lg border bg-white px-4 focus-within:border-primary",
        invalid ? "border-danger focus-within:border-danger" : "border-line",
        disabled && "bg-page",
      )}
    >
      {children}
    </div>
  );
}

export const inputClass =
  "h-full min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-ink-muted disabled:text-ink-sub";

export const inlineButtonClass =
  "shrink-0 text-xs font-bold text-primary disabled:text-ink-muted";

export const primaryButtonClass =
  "h-12 w-full rounded-lg bg-primary text-sm font-bold text-white hover:bg-primary-dark disabled:cursor-not-allowed disabled:bg-gray-300";
