import type { ReactNode } from 'react';
import MemberGate from './member-gate';

export default function MemberLayout({ children }: { children: ReactNode }) {
  return <MemberGate>{children}</MemberGate>;
}
