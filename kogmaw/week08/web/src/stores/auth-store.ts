import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AuthStore {
  accessToken: string | null;
  sessionId: number;
  setAccessToken: (accessToken: string | null) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      accessToken: null,
      sessionId: 0,
      setAccessToken: (accessToken) => set((state) =>
        state.accessToken === accessToken
          ? state
          : { accessToken, sessionId: state.sessionId + 1 },
      ),
    }),
    {
      name: "umcine-auth-store",
      storage: createJSONStorage(() => localStorage),
      partialize: ({ accessToken }) => ({ accessToken }),
    },
  ),
);

// The public ratings URL needs the member ID. Spring still verifies the token on writes.
export function getMemberId(accessToken: string): string | null {
  try {
    const payload = accessToken.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const { sub } = JSON.parse(atob(payload));
    return typeof sub === "string" && /^[1-9]\d*$/.test(sub) ? sub : null;
  } catch {
    return null;
  }
}
