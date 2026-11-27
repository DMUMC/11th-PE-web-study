import { getMovieDetail } from "@/lib/tmdb";

// 마이페이지처럼 브라우저에서 영화 정보가 필요할 때 TMDB 토큰을 숨긴 채 대신 받아 준다.
export async function GET(
  _request: Request,
  { params }: RouteContext<"/api/movies/[movieId]">,
) {
  const { movieId } = await params;
  const id = Number(movieId);

  if (!Number.isInteger(id) || id <= 0) {
    return Response.json({ message: "올바르지 않은 영화 번호예요." }, { status: 400 });
  }

  const movie = await getMovieDetail(id);
  if (!movie) {
    return Response.json({ message: "영화를 찾을 수 없어요." }, { status: 404 });
  }
  return Response.json(movie);
}
