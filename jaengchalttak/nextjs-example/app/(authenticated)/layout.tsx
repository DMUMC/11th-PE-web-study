import type { ReactNode } from "react";
import { AuthenticatedLayout } from "@/src/components/account/authenticated-layout";

export default function Layout({ children }: { children: ReactNode }) {
  return <AuthenticatedLayout>{children}</AuthenticatedLayout>;
}
