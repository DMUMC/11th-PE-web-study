import { LoginPage } from "@/views/auth/login-page";
import { RedirectIfAuthed } from "@/components/auth/auth-guards";

export default function Page() {
  return (
    <RedirectIfAuthed>
      <LoginPage />
    </RedirectIfAuthed>
  );
}