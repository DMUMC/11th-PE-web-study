import type { InputHTMLAttributes } from 'react';

interface AccountFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  error?: string;
  hint?: string;
}

export default function AccountField({ id, label, error, hint, ...props }: AccountFieldProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-semibold text-[#343840]">{label}</label>
      <input
        {...props}
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        className={`h-12 w-full rounded-lg border bg-white px-4 text-base transition-colors placeholder:text-gray-400 focus:border-primary ${error ? 'border-red-500' : 'border-[#dce0e6]'}`}
      />
      {error && <p id={`${id}-error`} role="alert" className="text-sm text-red-700">{error}</p>}
      {!error && hint && <p id={`${id}-hint`} className="text-sm text-[#687080]">{hint}</p>}
    </div>
  );
}
