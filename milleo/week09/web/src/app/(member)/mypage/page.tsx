import type { Metadata } from 'next';
import Profile from './profile';

export const metadata: Metadata = { title: '내 정보' };

export default function MyPage() {
  return <Profile />;
}
