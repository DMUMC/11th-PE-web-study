import { useQueries, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { movieApi } from "../../api";
import { getApiErrorMessage } from "../../api/api-client";
import { useFavoritesQuery } from "../../hooks/use-favorite";
import { useMyInfoQuery } from "../../hooks/use-my-info-query";
import { queryKeys } from "../../hooks/query-keys";
import { useAuthStore } from "../../stores/auth-store";

export function MyInfoPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const myInfoQuery = useMyInfoQuery();

  const handleLogout = () => {
    clearAuth();
    // 다른 회원으로 로그인했을 때 이전 회원의 캐시가 보이지 않도록 비워요.
    queryClient.clear();
    navigate({ to: "/login" });
  };

  if (myInfoQuery.isPending) {
    return <main className="mx-auto mt-10 max-w-sm p-4">내 정보를 불러오는 중이에요.</main>;
  }

  if (myInfoQuery.isError) {
    return (
      <main className="mx-auto mt-10 max-w-sm p-4">
        <p className="mb-4 text-sm text-red-600">
          {getApiErrorMessage(myInfoQuery.error, "내 정보를 불러오지 못했어요.")}
        </p>
        <Link to="/login" className="block w-full border px-2 py-1 text-center">
          로그인하러 가기
        </Link>
      </main>
    );
  }

  const myInfo = myInfoQuery.data;

  return (
    <main className="mx-auto mt-10 max-w-sm p-4">
      <h1 className="mb-4 text-xl font-bold">내 정보</h1>
      <form className="space-y-3">
        <div>
          <label className="block text-sm" htmlFor="my-email">이메일</label>
          <input id="my-email" className="w-full border px-2 py-1 disabled:bg-gray-100" value={myInfo.email} disabled />
        </div>
        <div>
          <label className="block text-sm" htmlFor="my-nickname">닉네임</label>
          <input id="my-nickname" className="w-full border px-2 py-1 disabled:bg-gray-100" value={myInfo.nickname} disabled />
        </div>
        <div>
          <label className="block text-sm" htmlFor="my-created-at">가입일</label>
          <input
            id="my-created-at"
            className="w-full border px-2 py-1 disabled:bg-gray-100"
            value={new Date(myInfo.createdAt).toLocaleDateString("ko-KR")}
            disabled
          />
        </div>
      </form>
      <div className="mt-4 flex gap-2">
        <Link to="/my/edit" className="flex-1 border px-2 py-1 text-center">
          내 정보 수정
        </Link>
        <button type="button" className="flex-1 border px-2 py-1" onClick={handleLogout}>
          로그아웃
        </button>
      </div>

      <MyFavorites />
    </main>
  );
}

// GET /favorites → movieId 목록. 제목/포스터는 영화 상세 캐시(TMDB)로 채워요.
function MyFavorites() {
  const favoritesQuery = useFavoritesQuery();
  const favorites = favoritesQuery.data ?? [];

  const movieQueries = useQueries({
    queries: favorites.map((favorite) => ({
      queryKey: queryKeys.movieDetail(favorite.movieId),
      queryFn: () => movieApi.getMovieDetail(favorite.movieId),
    })),
  });

  return (
    <section className="mt-8">
      <h2 className="mb-2 text-lg font-bold">즐겨찾기</h2>
      {favoritesQuery.isPending ? (
        <p className="text-sm">즐겨찾기를 불러오는 중이에요.</p>
      ) : favoritesQuery.isError ? (
        <p className="text-sm text-red-600">
          {getApiErrorMessage(favoritesQuery.error, "즐겨찾기를 불러오지 못했어요.")}
        </p>
      ) : favorites.length === 0 ? (
        <p className="text-sm">아직 즐겨찾기한 영화가 없어요.</p>
      ) : (
        <ul className="space-y-2">
          {favorites.map((favorite, index) => {
            const movie = movieQueries[index]?.data;
            return (
              <li key={favorite.favoriteId} className="flex items-center gap-2">
                {movie?.posterPath && (
                  <img src={movie.posterPath} alt="" width={40} height={60} />
                )}
                <Link
                  to="/movies/$movieId"
                  params={{ movieId: String(favorite.movieId) }}
                  className="underline"
                >
                  {movie?.title ?? `영화 #${favorite.movieId}`}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
