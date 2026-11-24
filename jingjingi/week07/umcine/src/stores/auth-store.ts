import { create } from "zustand";
import { persist } from "zustand/middleware";

interface MemberProfile {
  email: string;
  nickname: string;
}

interface AuthState {
  isLoggedIn: boolean;
  profile: MemberProfile;
  login: (email: string) => void;
  signup: (profile: MemberProfile) => void;
  updateProfile: (profile: MemberProfile) => void;
  logout: () => void;
}

const DEFAULT_PROFILE: MemberProfile = {
  email: "gwangsoo@umc.com",
  nickname: "광수",
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      profile: DEFAULT_PROFILE,
      login: (email) =>
        set((state) => ({
          isLoggedIn: true,
          profile: { ...state.profile, email },
        })),
      signup: (profile) => set({ isLoggedIn: true, profile }),
      updateProfile: (profile) => set({ profile }),
      logout: () => set({ isLoggedIn: false }),
    }),
    { name: "umcine-auth-store" },
  ),
);

export type { MemberProfile };
