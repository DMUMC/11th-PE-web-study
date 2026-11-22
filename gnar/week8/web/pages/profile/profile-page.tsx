import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getFavorites } from "../../api/cinema-api";
import { getApiErrorMessage } from "../../api/member-api";
import { movies } from "../../data/movies";
import { favoritesKey, useMember } from "../../hooks/use-member";
import { useAuthStore } from "../../stores/auth-store";
import "../auth/mission-auth.css";

export function ProfilePage() {
  const member = useMember();
  const token = useAuthStore((state) => state.accessToken)!;
  const favorites = useQuery({
    queryKey: favoritesKey(token),
    queryFn: ({ signal }) => getFavorites(token, signal),
  });

  return (
    <section className="week7-auth" aria-labelledby="profile-title">
      <h1 id="profile-title">내 정보</h1>
      {member.isLoading && <p>내 정보를 불러오는 중…</p>}
      {member.isError && <p role="alert">{getApiErrorMessage(member.error)}</p>}
      {member.data && (
        <>
          <dl>
            <dt>이메일</dt><dd>{member.data.email}</dd>
            <dt>닉네임</dt><dd>{member.data.nickname}</dd>
          </dl>
          <Link to="/mypage/edit" className="week7-primary">내 정보 수정</Link>
        </>
      )}
      <h2 className="mt-8 text-xl font-bold">즐겨찾기</h2>
      {favorites.isLoading && <p>즐겨찾기를 불러오는 중…</p>}
      {favorites.isError && <p role="alert">{getApiErrorMessage(favorites.error)}</p>}
      {favorites.data?.length === 0 && <p>등록한 즐겨찾기가 없어요.</p>}
      <ul className="mt-2 space-y-2">
        {favorites.data?.map((favorite) => {
          const id = typeof favorite === "number" ? favorite : favorite.movieId;
          const movie = movies.find((item) => item.id === id);
          return (
            <li key={id}>
              {movie ? <Link to="/movies/$movieId" params={{ movieId: String(id) }}>{movie.title}</Link> : `영화 #${id}`}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
