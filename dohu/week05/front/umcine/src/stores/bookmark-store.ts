import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface BookmarkStore {
  bookmarkedMovieIds: number[];
  toggleBookmark: (movieId: number) => void;
}

// 저장값은 개발자 도구에서 바뀔 수 있으므로 양의 정수 ID만 남긴다.
function toMovieIds(value: unknown): number[] {
  if (typeof value !== "object" || value === null) return [];

  const { bookmarkedMovieIds } = value as { bookmarkedMovieIds?: unknown };
  if (!Array.isArray(bookmarkedMovieIds)) return [];

  return bookmarkedMovieIds.filter(
    (movieId): movieId is number =>
      typeof movieId === "number" && Number.isInteger(movieId) && movieId > 0,
  );
}

export const useBookmarkStore = create<BookmarkStore>()(
  persist(
    (set) => ({
      bookmarkedMovieIds: [],
      toggleBookmark: (movieId) =>
        set((state) => ({
          bookmarkedMovieIds: state.bookmarkedMovieIds.includes(movieId)
            ? state.bookmarkedMovieIds.filter((id) => id !== movieId)
            : [...state.bookmarkedMovieIds, movieId],
        })),
    }),
    {
      name: "umcine-bookmark-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        bookmarkedMovieIds: state.bookmarkedMovieIds,
      }),
      merge: (persistedState, currentState) => ({
        ...currentState,
        bookmarkedMovieIds: toMovieIds(persistedState),
      }),
    },
  ),
);
