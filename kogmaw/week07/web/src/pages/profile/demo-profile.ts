export interface DemoProfile {
  email: string;
  nickname: string;
}

const STORAGE_KEY = "umcine-week7-demo-profile";

export function readProfile(): DemoProfile {
  const stored = sessionStorage.getItem(STORAGE_KEY);
  return stored
    ? JSON.parse(stored)
    : { email: "movie@example.com", nickname: "영화친구" };
}

export function saveProfile(profile: DemoProfile) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
}
