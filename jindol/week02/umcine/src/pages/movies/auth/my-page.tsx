import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getFavorites } from "../../../api/favorites";

export function MyPage() {
  const favoritesQuery = useQuery({
    queryKey: ["favorites"],
    queryFn: getFavorites,
  });

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">마이페이지</h1>
          <p className="mt-2 text-sm text-slate-600">내가 즐겨찾기한 영화예요.</p>
        </div>
        <Link
          to="/profile"
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          내 정보 수정
        </Link>
      </div>

      {favoritesQuery.isPending ? (
        <p aria-live="polite" className="text-center text-slate-500">즐겨찾기를 불러오는 중이에요...</p>
      ) : favoritesQuery.isError ? (
        <p role="alert" className="text-center text-red-600">{favoritesQuery.error.message}</p>
      ) : favoritesQuery.data.length === 0 ? (
        <p className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500">
          아직 즐겨찾기한 영화가 없어요.
        </p>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {favoritesQuery.data.map((favorite) => (
            <li key={favorite.movieId}>
              <Link
                to="/movies/$movieId"
                params={{ movieId: String(favorite.movieId) }}
                className="block rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-blue-300 hover:shadow-sm"
              >
                <span className="font-semibold text-slate-900">영화 #{favorite.movieId}</span>
                <span className="mt-2 block text-sm text-blue-700">상세 정보 보기 →</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
