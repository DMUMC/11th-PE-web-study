import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AuthStore {
  accessToken: string | null;
  // 서버에서 만든 HTML에는 토큰이 없으므로, 브라우저에서 localStorage를 읽기 전까지는 판단을 미룬다.
  hasHydrated: boolean;
  setAccessToken: (accessToken: string | null) => void;
}

// 토큰은 브라우저가 원본이라 클라이언트 상태로 둔다. 회원 정보는 query 캐시에서 읽는다.
export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      accessToken: null,
      hasHydrated: false,
      setAccessToken: (accessToken) => set({ accessToken }),
    }),
    {
      name: "umcine-auth-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ accessToken: state.accessToken }),
      // 서버 렌더링 중에는 localStorage가 없어서 자동으로 읽지 않고 Providers에서 직접 읽는다.
      skipHydration: true,
      onRehydrateStorage: () => () => {
        useAuthStore.setState({ hasHydrated: true });
      },
    },
  ),
);
