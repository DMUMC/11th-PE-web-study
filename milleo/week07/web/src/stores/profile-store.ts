import { create } from 'zustand';
import { account, AccountError, type Profile } from '../api/account';
export type { Profile } from '../api/account';
interface ProfileState {
  profile: Profile | null;
  loading: boolean;
  error: string;
  updateProfile: (profile: Profile | null) => void;
  refresh: () => Promise<void>;
}
export const useProfileStore = create<ProfileState>((set) => ({
  profile: null, loading: true, error: '',
  updateProfile: (profile) => set({ profile, loading: false, error: '' }),
  refresh: async () => {
    set({ loading: true, error: '' });
    try { set({ profile: await account.me(), loading: false }); }
    catch (error) { set({ profile: null, loading: false, error: error instanceof AccountError && error.status === 401 ? '' : (error as Error).message }); }
  },
}));
