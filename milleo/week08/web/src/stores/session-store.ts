import { create } from 'zustand';

const storageKey = 'umcine-access-token';

interface Session {
  token: string | null;
  revision: number;
  setToken: (token: string | null) => void;
}

export const useSession = create<Session>((set, get) => ({
  token: sessionStorage.getItem(storageKey),
  revision: 0,
  setToken(token) {
    if (token === get().token) return;
    if (token) sessionStorage.setItem(storageKey, token);
    else sessionStorage.removeItem(storageKey);
    set(state => ({ token, revision: state.revision + 1 }));
  },
}));
