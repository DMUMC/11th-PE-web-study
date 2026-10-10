
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface BookmarkStore {
  bookmarkIds: number[];
  isBookmarked: (id: number) => boolean;
  toggleBookmark: (id: number) => void;
}

export const useBookmarkStore = create<BookmarkStore>()(
  persist(
    (set, get) => ({
      bookmarkIds: [],

      isBookmarked: (id) => get().bookmarkIds.includes(id),

      toggleBookmark: (id) =>
        set((state) => ({
          bookmarkIds: state.bookmarkIds.includes(id)
            ? state.bookmarkIds.filter((movieId) => movieId !== id)
            : [...state.bookmarkIds, id],
        })),
    }),
    {
      name: "umcine-bookmark-store",
    },
  ),
);
