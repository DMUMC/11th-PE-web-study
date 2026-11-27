import type { StateStorage } from "zustand/middleware";

const serverStorage: StateStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};

export function getSafeStorage(): StateStorage {
  return typeof window === "undefined" ? serverStorage : window.localStorage;
}
