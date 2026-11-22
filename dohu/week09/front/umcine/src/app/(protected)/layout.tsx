import { ProtectedGuard } from "@/components/layout/protected-guard";

// 토큰이 브라우저 localStorage에 있어서 서버가 미리 만들 수 있는 화면이 없다.
// 즉시 이동 검사에서 이 구간을 빼고, 화면은 ProtectedGuard가 토큰을 확인한 뒤에 그린다.
export const instant = false;

// 괄호 폴더는 주소에 들어가지 않는다. 로그인 후에만 볼 수 있는 페이지를 이 폴더에 모은다.
export default function ProtectedLayout({ children }: LayoutProps<"/">) {
  return <ProtectedGuard>{children}</ProtectedGuard>;
}
