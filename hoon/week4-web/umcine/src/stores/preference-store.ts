import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type CardSize = "normal" | "large";
export type SortOption = "latest" | "title";

interface PreferenceStore {
  cardSize: CardSize;
  sortBy: SortOption;
  setCardSize: (cardSize: CardSize) => void;
  setSortBy: (sortBy: SortOption) => void;
}

export const usePreferenceStore = create<PreferenceStore>()(
  persist(
    (set) => ({
      cardSize: "normal",
      sortBy: "latest",
      setCardSize: (cardSize) => set({ cardSize }),
      setSortBy: (sortBy) => set({ sortBy }),
    }),
    {
      name: "umcine-preference-store",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
