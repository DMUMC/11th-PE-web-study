// 목록, 검색 카드에서 쓰는 영화
export interface Movie {
  id: number;
  title: string;
  originalTitle: string;
  releaseDate: string; // "2026.07.29", 정보가 없으면 ""
  posterPath?: string; // <img src>에 바로 쓰는 전체 URL, 없으면 undefined
  overview: string;
}

// 목록, 검색 응답 (페이지 정보 포함)
export interface MoviePage {
  page: number;
  totalPages: number;
  totalResults: number;
  movies: Movie[];
}

// 상세 화면에서 쓰는 영화
export interface MovieDetail extends Movie {
  backdropPath?: string; // 전체 URL, 없으면 undefined
  genres: string[];
  runtime: string | null; // "2시간 25분", 정보가 없으면 null
  tagline: string;
}
