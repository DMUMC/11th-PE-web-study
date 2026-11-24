import type { Movie } from "../../types/movie";
import { Link } from "@tanstack/react-router";
import { useBookmarkStore } from "../../stores/bookmark-store";

export default function MovieCard(props: Movie) {
    const isBookmarked = useBookmarkStore((state) =>
        state.bookmarkedMovieIds.includes(props.id),
    );

    const toggleBookmark = useBookmarkStore(
        (state) => state.toggleBookmark,
    );

    return (
        <div className="relative">
            <li className="list-none">
                <Link
                    to="/movies/$movieId"
                    params={{ movieId: String(props.id) }}
                >
                    <img
                        src={props.posterPath}
                        alt={props.title}
                        className="w-[240px] h-[274px] rounded-[8px]"
                    />
                </Link>

                <div
                    className={`w-[34px] h-[34px] absolute top-[8px] right-[6px]
                    ${isBookmarked
                            ? "bg-[#2563EB]"
                            : "bg-[#17191E] border-1 border-white"
                        }
                    rounded-[8px] flex justify-center items-center`}
                    onClick={() => toggleBookmark(props.id)}
                >
                    {isBookmarked ? (
                        <img
                            src="/icon/movie-icons/bookmarkYes.svg"
                            className="w-[24px] h-[24px]"
                        />
                    ) : (
                        <img
                            src="/icon/movie-icons/bookmarkNo.svg"
                            className="w-[24px] h-[24px]"
                        />
                    )}
                </div>

                <p className="text-[14px] font-[800] text-[#17191E] mt-[5px]">
                    {props.title}
                </p>

                <p className="text-[12px] font-[400] text-[#969DA8]">
                    {props.releaseDate}
                </p>
            </li>
        </div>
    );
}