import { Link } from "@tanstack/react-router";
import { getApiErrorMessage } from "../../api/api-client";
import { movies } from "../../data/movies";
import { useFavorites } from "../../hooks/use-favorites";
import { useMe } from "../../hooks/use-member";
import { useAuthStore } from "../../stores/auth-store";
import "../auth/mission-auth.css";

export function ProfilePage() {
  const me = useMe();
  const favorites = useFavorites();
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  return (
    <main className="week7-auth" aria-labelledby="profile-title">
      <h1 id="profile-title">마이페이지</h1>
      {me.isLoading && <p role="status">내 정보를 불러오는 중…</p>}
      {me.isError && <p role="alert" className="text-red-700">{getApiErrorMessage(me.error)}</p>}
      {me.data && (
        <>
          <dl>
            <dt>이메일</dt>
            <dd>{me.data.email}</dd>
            <dt>닉네임</dt>
            <dd>{me.data.nickname}</dd>
            <dt>가입일</dt>
            <dd>{me.data.createdAt.slice(0, 10)}</dd>
          </dl>
          <Link to="/mypage/edit" className="week7-primary">내 정보 수정</Link>
        </>
      )}
      <section className="my-6 border-y border-slate-200 py-5" aria-labelledby="favorites-title">
        <h2 id="favorites-title" className="mb-3 text-lg font-bold">즐겨찾기</h2>
        {favorites.isLoading && <p role="status">즐겨찾기를 불러오는 중…</p>}
        {favorites.isError && <p role="alert" className="text-red-700">{getApiErrorMessage(favorites.error)}</p>}
        {favorites.data?.length === 0 && <p>즐겨찾기한 영화가 없어요.</p>}
        {favorites.data && favorites.data.length > 0 && (
          <ul className="space-y-2">
            {favorites.data.map(({ favoriteId, movieId }) => {
              const movie = movies.find((item) => item.id === movieId);
              return (
                <li key={favoriteId}>
                  {movie ? (
                    <Link to="/movies/$movieId" params={{ movieId: String(movieId) }}>
                      {movie.title}
                    </Link>
                  ) : `영화 #${movieId}`}
                </li>
              );
            })}
          </ul>
        )}
      </section>
      <button type="button" onClick={() => setAccessToken(null)}>로그아웃</button>
    </main>
  );
}
