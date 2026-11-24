import { createFileRoute } from "@tanstack/react-router";
import { movies } from "../data/movies";
import { useBookmarkStore } from "../stores/bookmark-store";

export const Route = createFileRoute("/movies/$movieId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { movieId } = Route.useParams();

  const movie = movies.find(
    (movie) => movie.id === Number(movieId),
  );

  const genre = movie?.genres;
  const score = [1, 2, 3, 4, 5];
  const movieLastId = movies.length;

  // Zustand에서 현재 영화의 북마크 상태 확인
  const isBookmarked = useBookmarkStore((state) =>
    state.bookmarkedMovieIds.includes(movie?.id ?? 0),
  );

  // Zustand의 북마크 변경 함수
  const toggleBookmark = useBookmarkStore(
    (state) => state.toggleBookmark,
  );

  return (
    <>
      {Number(movieId) <= movieLastId ? (
        <>
          {/* 영화 상단 */}
          <div className="relative text-white">
            <img
              src={movie?.backdropPath}
              className="w-full h-[360px] object-cover"
            />

            <div className="px-[80px]">
              {/* 영화 목록 */}
              <div className="absolute top-[24px] flex items-center">
                <img
                  src="/icon/movie-icons/chevron-left.svg"
                  className="w-[24px] h-[24px]"
                />

                <p className="font-[700] text-[13px]">
                  영화 목록
                </p>
              </div>

              {/* 영화 정보 */}
              <div className="absolute top-[210px] gap-[8px]">
                <p className="font-[700] text-[46px]">
                  {movie?.title}
                </p>

                <p className="font-[400] text-[14px]">
                  {movie?.originalTitle}
                </p>

                <div className="flex items-center gap-[8px] font-[700] text-[13px]">
                  <p>{movie?.releaseDate}</p>

                  {genre?.map((genre, index) => (
                    <p key={genre}>
                      {genre}
                      {index !== genre.length - 1 && " ·"}
                    </p>
                  ))}

                  <p>{movie?.runtime}</p>
                </div>
              </div>
            </div>
          </div>

          {/* 하단 */}
          <div className="flex py-[24px] gap-[30px]">
            {/* 왼쪽 - 포스터 */}
            <img
              src={movie?.posterPath}
              className="w-[200px] h-[286px] rounded-[16px]"
            />

            {/* 가운데 - 영화 정보 */}
            <div className="flex-1 flex flex-col gap-[12px]">
              <p className="font-[700] text-[21px] text-[#17191E]">
                {movie?.tagline}
              </p>

              <p className="font-[400] text-[14px] text-[#606774]">
                {movie?.overview}
              </p>

              {/* 즐겨찾기 버튼 */}
              <button
                type="button"
                onClick={() => {
                  if (movie) {
                    toggleBookmark(movie.id);
                  }
                }}
                className={`w-[108px] h-[42px] rounded-[8px]
                  flex items-center gap-[8px]
                  font-[800] text-[14px] text-white
                  justify-center ${isBookmarked
                    ? "bg-[#2563EB]"
                    : "bg-[#17191E]"
                  }`}
              >
                <img
                  src={
                    isBookmarked
                      ? "/icon/movie-icons/bookmarkYes.svg"
                      : "/icon/movie-icons/bookmarkNo.svg"
                  }
                  className="w-[16px] h-[16px]"
                />

                <p>
                  {isBookmarked
                    ? "즐겨찾기 해제"
                    : "즐겨찾기"}
                </p>
              </button>
            </div>

            {/* 오른쪽 - 평점 */}
            <div className="flex flex-col gap-[8px] w-[360px] pl-[30px] border-l-1 border-[#E3E6EB]">
              <p className="font-[700] text-[21px] text-[#17191E]">
                내 평점
              </p>

              <p className="font-[400] text-[12px] text-[#969DA8]">
                별점은 필수, 후기는 선택이에요.
              </p>

              {/* 별점 */}
              <div className="flex gap-[4px]">
                {score.map((num) => (
                  <img
                    key={num}
                    src="/icon/movie-icons/oneScore.svg"
                    className="w-[38px] h-[38px]"
                  />
                ))}
              </div>

              {/* 후기 */}
              <div
                className="w-[330px] h-[102px] px-[12px] py-[18px]
                rounded-[16px] bg-white border-1 border-[#E3E6EB]"
              >
                <textarea
                  className="w-full h-full
                  placeholder:text-[13px] placeholder:font-[400]"
                  placeholder="영화를 보고 느낀 점을 남겨보세요."
                />
              </div>

              {/* 평점 저장 */}
              <div
                className="w-[330px] h-[42px] bg-[#17191E]
                rounded-[8px] text-white px-[16px]
                flex items-center justify-center
                text-[14px] font-[800]"
              >
                평점 저장
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <p className="mt-[24px]">
            영화를 찾을 수 없어요.
          </p>
        </>
      )}
    </>
  );
}