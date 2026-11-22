"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getMovieDetail } from "../../api/movies/get-movie-detail";
import { useFavorites } from "../../hooks/use-favorites";

function FavoriteMovieLink({ movieId }: { movieId: number }) {
  const movie = useQuery({
    queryKey: ["movies", "detail", movieId],
    queryFn: ({ signal }) => getMovieDetail(movieId, signal),
    staleTime: 30_000,
    retry: false,
  });
  return (
    <Link href={`/movies/${movieId}`} className="block py-3 text-sm font-semibold text-[#2864dc] hover:underline">
      {movie.data?.title ?? `영화 #${movieId}`}
    </Link>
  );
}

export function FavoriteMovies() {
  const favorites = useFavorites();
  return (
    <section className="mt-8" aria-labelledby="favorite-movies-title">
      <h2 id="favorite-movies-title" className="mb-3 text-lg font-bold">즐겨찾기</h2>
      {favorites.isPending ? <p role="status" className="text-sm">즐겨찾기를 불러오는 중이에요.</p>
        : favorites.isError ? (
          <p role="alert" className="text-sm">즐겨찾기를 불러오지 못했어요.{" "}
            <button type="button" onClick={() => void favorites.refetch()} className="text-[#2864dc] underline">다시 시도</button>
          </p>
        ) : favorites.data.length === 0 ? <p className="text-sm text-[#676d76]">즐겨찾기한 영화가 없어요.</p>
        : <ul className="divide-y divide-[#e3e6eb]">{favorites.data.map(({ movieId }) => (
          <li key={movieId}><FavoriteMovieLink movieId={movieId} /></li>
        ))}</ul>}
    </section>
  );
}
