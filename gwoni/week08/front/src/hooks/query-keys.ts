// 여러 화면에서 같은 캐시를 가리키도록 query key를 한곳에서 관리해요.
export const queryKeys = {
  myInfo: ["members", "me"] as const,
  favorites: ["favorites"] as const,
  favoriteList: ["favorites", "list"] as const,
  favoriteStatus: (movieId: number) => ["favorites", "status", movieId] as const,
  memberRatings: (memberId: number) => ["ratings", "member", memberId] as const,
  movieDetail: (movieId: number) => ["movies", "detail", movieId] as const,
};
