import type { Metadata } from 'next';
import EditProfile from './edit-profile';

export const metadata: Metadata = { title: '내 정보 수정' };

export default function ProfileEditPage() {
  return <EditProfile />;
}
