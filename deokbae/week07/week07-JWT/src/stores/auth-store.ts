import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AuthStore {
  accessToken: string | null;
  nickname: string | null;
  login: (accessToken: string, nickname: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      accessToken: null,
      nickname: null,
      login: (accessToken, nickname) => set({ accessToken, nickname }),
      logout: () => set({ accessToken: null, nickname: null }),
    }),
    {
      name: "umcine-auth-store",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);