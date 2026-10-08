import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import {
  readBookmarkIds,
  saveBookmarkIds,
} from "../utils/bookmark-storage";

interface BookmarkContextType {
  bookmarkIds: number[];
  isBookmarked: (id: number) => boolean;
  toggleBookmark: (id: number) => void;
}

const BookmarkContext = createContext<BookmarkContextType | undefined>(
  undefined,
);

export function BookmarkProvider({ children }: { children: ReactNode }) {
  const [bookmarkIds, setBookmarkIds] = useState<number[]>(readBookmarkIds);

  useEffect(() => {
    saveBookmarkIds(bookmarkIds);
  }, [bookmarkIds]);

  const isBookmarked = (id: number) => bookmarkIds.includes(id);

  const toggleBookmark = (id: number) => {
    setBookmarkIds((prev) =>
      prev.includes(id)
        ? prev.filter((movieId) => movieId !== id)
        : [...prev, id],
    );
  };

  return (
    <BookmarkContext.Provider
      value={{ bookmarkIds, isBookmarked, toggleBookmark }}
    >
      {children}
    </BookmarkContext.Provider>
  );
}

export function useBookmarks() {
  const context = useContext(BookmarkContext);

  if (!context) {
    throw new Error("useBookmarks must be used within BookmarkProvider");
  }

  return context;
}