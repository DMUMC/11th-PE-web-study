import type { ReactNode } from "react";
import { AuthGuard } from "../../src/components/auth-guard";

export default function AuthenticatedLayout({ children }: { children: ReactNode }) {
  return <AuthGuard>{children}</AuthGuard>;
}
