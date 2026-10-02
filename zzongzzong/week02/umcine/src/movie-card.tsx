import { useState } from "react";
import type { Movie } from "./types/movie";
import { movies } from "./data/movies";


export default function MovieCard(props: { id: number, title: string, posterPath: string, releaseDate: string, isBookmarked: boolean, onBookmark: (movieId: number) => void }) {
    const [mark, setMark] = useState(props.isBookmarked);
    const bookmark = () => {
        setMark(!mark);
    }
    return (
        <div className="relative">
            <li key={props.id} className="list-none">
                <img src={props.posterPath} alt={props.title} className="w-[240px] h-[274px] rounded-[8px]" />
                <div className={`w-[34px] h-[34px] absolute top-[8px] right-[6px] 
                ${mark ? 'bg-[#2563EB]' : 'bg-[#17191E] border-1 border-white'} rounded-[8px] flex justify-center items-center`}
                    onClick={() =>
                        // props.onBookmark(props.id)
                        bookmark()
                    }
                >
                    {mark ?
                        <img src="/icon/movie-icons/bookmarkYes.svg" className="w-[24px] h-[24px]" /> :
                        <img src="/icon/movie-icons/bookmarkNo.svg" className="w-[24px] h-[24px]" />
                    }
                </div>
                <p className="text-[14px] font-[800] text-[#17191E] mt-[5px]">{props.title}</p>
                <p className="text-[12px] font-[400] text-[#969DA8]">{props.releaseDate}</p>
            </li>
        </div>
    )
}