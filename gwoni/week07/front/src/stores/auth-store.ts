import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  accessToken: string | null;
  nickname: string | null;
  setAuth: (accessToken: string, nickname: string) => void;
  setNickname: (nickname: string) => void;
  clearAuth: () => void;
}

// 로그인 응답의 accessToken을 저장해 두고, 회원 서버 요청마다 꺼내 써요.
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      nickname: null,
      setAuth: (accessToken, nickname) => set({ accessToken, nickname }),
      setNickname: (nickname) => set({ nickname }),
      clearAuth: () => set({ accessToken: null, nickname: null }),
    }),
    { name: "umcine-auth-store" },
  ),
);
