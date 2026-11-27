import { create } from 'zustand';

const storageKey = 'umcine-access-token';

interface Session {
  token: string | null;
  revision: number;
  ready: boolean;
  restoreSession: () => void;
  setToken: (token: string | null) => void;
}

export const useSession = create<Session>((set, get) => ({
  token: null,
  revision: 0,
  ready: false,
  restoreSession() {
    if (get().ready) return;
    let token: string | null = null;
    try {
      token = window.sessionStorage.getItem(storageKey);
    } catch {
      // Storage can be unavailable when the browser blocks persistence.
    }
    set(state => ({ token, ready: true, revision: state.revision + Number(Boolean(token)) }));
  },
  setToken(token) {
    if (token === get().token) return;
    try {
      if (token) window.sessionStorage.setItem(storageKey, token);
      else window.sessionStorage.removeItem(storageKey);
    } catch {
      // The in-memory session still works in this tab.
    }
    set(state => ({ token, ready: true, revision: state.revision + 1 }));
  },
}));
