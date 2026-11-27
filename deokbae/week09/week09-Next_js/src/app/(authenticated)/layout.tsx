import { RequireAuth } from "@/components/auth/auth-guards";

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RequireAuth>{children}</RequireAuth>;
}