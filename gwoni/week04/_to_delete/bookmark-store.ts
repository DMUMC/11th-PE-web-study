import { create } from "zustand";

interface BookmarkState {
  bookmarkedIds: number[];
  toggleBookmark: (id: number) => void;
}

export const useBookmarkStore = create<BookmarkState>((set) => ({
  bookmarkedIds: [],
  toggleBookmark: (id) =>
    set((state) => ({
      bookmarkedIds: state.bookmarkedIds.includes(id)
        ? state.bookmarkedIds.filter((v) => v !== id)
        : [...state.bookmarkedIds, id],
    })),
}));
