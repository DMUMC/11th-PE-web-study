import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { readBookmarkIds } from "../utils/bookmark-storage";
import { getSafeStorage } from "../utils/safe-storage";

interface BookmarkStore {
  bookmarkedMovieIds: number[];
  toggleBookmark: (movieId: number) => void;
  setBookmarkedMovieIds: (movieIds: number[]) => void;
}

export const useBookmarkStore = create<BookmarkStore>()(
  persist(
    (set) => ({
      bookmarkedMovieIds: [],
      setBookmarkedMovieIds: (bookmarkedMovieIds) => set({ bookmarkedMovieIds }),
      toggleBookmark: (movieId) =>
        set((state) => ({
          bookmarkedMovieIds: state.bookmarkedMovieIds.includes(movieId)
            ? state.bookmarkedMovieIds.filter((id) => id !== movieId)
            : [...state.bookmarkedMovieIds, movieId],
        })),
    }),
    {
      name: "umcine-bookmark-store",
      storage: createJSONStorage(getSafeStorage),
      skipHydration: true,
      partialize: (state) => ({
        bookmarkedMovieIds: state.bookmarkedMovieIds,
      }),
      onRehydrateStorage: () => (state, error) => {
        if (!error && state && state.bookmarkedMovieIds.length === 0) {
          const legacyBookmarkIds = readBookmarkIds();
          if (legacyBookmarkIds.length > 0) {
            state.setBookmarkedMovieIds(legacyBookmarkIds);
          }
        }
      },
    },
  ),
);