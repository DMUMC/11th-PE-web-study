import { create } from "zustand";

interface ProfilePreview {
  email: string;
  nickname: string;
  setNickname: (nickname: string) => void;
}

export const useProfilePreviewStore = create<ProfilePreview>((set) => ({
  email: "umcine@example.com",
  nickname: "영화친구",
  setNickname: (nickname) => set({ nickname }),
}));
