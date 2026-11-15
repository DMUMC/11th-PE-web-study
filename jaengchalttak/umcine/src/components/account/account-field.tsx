import { useId, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { cn } from "../../utils/cn";

type AccountFieldProps = ComponentPropsWithoutRef<"input"> & {
  label: string;
  icon?: "mail" | "person" | "lock";
  error?: string;
  hint?: string;
  action?: ReactNode;
  variant?: "default" | "inline";
};

export function AccountField({ label, icon, error, hint, action, variant = "default", ...inputProps }: AccountFieldProps) {
  const id = useId();
  const inline = variant === "inline";
  const message = error ?? hint;
  return (
    <div>
      <label htmlFor={id} className={cn("block text-sm font-semibold text-[#1d1e20]", inline ? "mb-1.5" : "mb-2")}>{label}</label>
      <div className="flex gap-2">
        <div className="relative min-w-0 flex-1">
          {icon && <img src={`/icons/movie-icons/${icon}.svg`} alt="" className="pointer-events-none absolute top-3.5 left-3 size-5 opacity-60" />}
          <input
            {...inputProps}
            id={id}
            aria-invalid={error ? true : undefined}
            aria-describedby={message ? `${id}-message` : undefined}
            className={cn(
              "h-12 w-full rounded-lg border border-[#e3e6eb] bg-white px-3 text-sm text-[#1d1e20] focus:border-[#2864dc] focus:outline-2 focus:outline-[#2864dc]/20 disabled:bg-[#f7f8fa] read-only:bg-[#f7f8fa] aria-invalid:border-red-500",
              icon && "pl-10",
              inline && "rounded-md px-4 placeholder:text-[#9299a4]",
              inline && action && "pr-28",
            )}
          />
          {inline && action && <div className="absolute inset-y-0 right-4 flex items-center">{action}</div>}
        </div>
        {!inline && action}
      </div>
      {message && <p id={`${id}-message`} className={cn("mt-1.5 text-xs", error ? "text-red-700" : "text-[#676d76]")}>{message}</p>}
    </div>
  );
}
