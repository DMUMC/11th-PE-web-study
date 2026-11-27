import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AuthStore {
  accessToken: string | null;
  sessionId: number;
  setAccessToken: (token: string | null) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      accessToken: null,
      sessionId: 0,
      setAccessToken: (accessToken) => set((state) =>
        state.accessToken === accessToken ? state : { accessToken, sessionId: state.sessionId + 1 }),
    }),
    {
      name: "umcine-auth-store",
      storage: createJSONStorage(() => {
        if (typeof window === "undefined") throw new Error("Browser storage is unavailable");
        return window.localStorage;
      }),
      skipHydration: true,
      partialize: ({ accessToken }) => ({ accessToken }),
    },
  ),
);

// The subject is a lookup key only. Authentication and ownership are verified by the API.
export function getTokenMemberId(token: string) {
  try {
    const payload: { sub?: string | number } = JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
    const id = Number(payload.sub);
    return Number.isSafeInteger(id) && id > 0 ? id : null;
  } catch {
    return null;
  }
}
