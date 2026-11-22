import { AuthenticatedLayout } from "@/src/components/account/authenticated-layout";
import { LoginPage } from "@/src/screens/auth/login-page";

export const metadata = { title: "로그인 | UMCine" };

export default function Page() {
  return <AuthenticatedLayout guestOnly><LoginPage /></AuthenticatedLayout>;
}
