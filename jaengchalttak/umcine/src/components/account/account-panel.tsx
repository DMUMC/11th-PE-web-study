import type { ReactNode } from "react";

export function AccountPanel({ title, description, children }: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <main className="flex min-h-[calc(100vh-91px)] justify-center bg-[#f7f8fa] px-4 py-10 sm:py-16">
      <section aria-labelledby="account-title" className="h-fit w-full max-w-xl rounded-2xl border border-[#e3e6eb] bg-white p-6 shadow-sm sm:p-10">
        <h1 id="account-title" className="text-center text-3xl font-bold tracking-tight text-[#1d1e20]">{title}</h1>
        <p className="mt-2 mb-8 text-center text-sm text-[#676d76]">{description}</p>
        {children}
      </section>
    </main>
  );
}
