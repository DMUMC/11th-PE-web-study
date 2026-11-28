import { create } from 'zustand';
import { persist } from 'zustand/middleware';
export const useAuthStore = create<{ accessToken: string | null; setAccessToken: (token: string | null) => void }>()(persist(set => ({ accessToken: null, setAccessToken: accessToken => set({ accessToken }) }), { name: 'umcine-auth-store', skipHydration: true }));
