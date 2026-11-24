import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState, type SubmitEvent } from "react";
import { movies } from "../../data/movies";

export function SearchPage() {
    const { query } = useSearch({ from: "/search" });
    const navigate = useNavigate({ from: "/search" });
    const [searchText, setSearchText] = useState(query ?? "");

    useEffect(() => {
        setSearchText(query ?? "");
    }, [query]);

    const normalizedQuery = query?.trim().toLowerCase() ?? "";
    const searchResults = normalizedQuery
        ? movies.filter(
            (movie) =>
                movie.title.toLowerCase().includes(normalizedQuery) ||
                movie.originalTitle.toLowerCase().includes(normalizedQuery),
        )
        : [];

    function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        const nextQuery = searchText.trim();
        navigate({
            search: nextQuery ? { query: nextQuery } : {},
        });
    }

    return (
        <main>
            <p className="font-[700] text-[36px] my-[24px]">영화 검색</p>
            <form onSubmit={handleSubmit} className="pl-[15px] pr-[10px] flex items-center w-[1280px] h-[54px] bg-white rounded-[8px] gap-[18px]">
                <img src="/icon/movie-icons/search.svg" className="w-[18px] h-[18px]" />
                <input
                    aria-label="검색어"
                    value={searchText}
                    onChange={(event) => setSearchText(event.target.value)}
                    className="flex-1"
                    placeholder="검색어를 입력해주세요."
                />
                <img src='/icon/movie-icons/close.svg' onClick={() => {
                    setSearchText("");
                }} />
                <button type="submit" className="w-[86px] h-[42px] rounded-[8px] bg-[#17191E]
                font-[800] text-[14px] text-white
                ">검색</button>
            </form>

            {!normalizedQuery ? (
                <p className="my-[8px]">검색어를 입력해 주세요.</p>
            ) : (
                <>
                    <div className="flex items-center w-full justify-between">
                        <h2 className="my-[8px] font-[700] text-[18px]">‘{query}’ 검색 결과</h2>
                        <p className="font-[400] text-[12px] text-[#969DA8]">영화 {searchResults.length}편</p>
                    </div>
                    {searchResults.length === 0 ? (
                        <p>검색 결과가 없어요.</p>
                    ) : (
                        <div className="grid grid-cols-2 gap-[10px]">
                            {searchResults.map((movie) => (
                                <li key={movie.id} className="list-none flex gap-[18px]">
                                    <img src={movie.posterPath} alt={`${movie.title} 포스터`} className="w-[126px] h-[190px] rounded-[10px]" />
                                    <div className="flex flex-col gap-[8px]">
                                        <p className="text-[18px] font-[700] text-[#17191E]">{movie.title}</p>
                                        <p className="text-[12px] font-[400] text-[#969DA8] flex">{movie.originalTitle}<span className="w-[8px]"></span>{movie.releaseDate}</p>
                                        <p className="font-[400] text-[13px] text-[#606774]">{movie.overview}</p>
                                        <Link
                                            to="/movies/$movieId"
                                            params={{ movieId: String(movie.id) }}
                                            className="flex items-center font-[800] text-[12px] text-[#2563EB] gap-[4px]"
                                        >
                                            상세 보기
                                            <img src="/icon/movie-icons/arrow-right.svg" className="w-[16px] h-[16px]" />
                                        </Link>
                                    </div>
                                </li>
                            ))}
                        </div>
                    )}
                </>
            )}
        </main>
    );
}