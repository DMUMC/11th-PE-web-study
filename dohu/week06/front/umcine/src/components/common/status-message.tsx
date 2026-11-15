import { cn } from "../../utils/cn";

interface StatusMessageProps {
  children: string;
  tone?: "default" | "error";
  className?: string;
}

export function StatusMessage({
  children,
  tone = "default",
  className,
}: StatusMessageProps) {
  return (
    <p
      role={tone === "error" ? "alert" : "status"}
      className={cn(
        "py-20 text-center text-sm",
        tone === "error" ? "text-danger" : "text-ink-sub",
        className,
      )}
    >
      {children}
    </p>
  );
}
