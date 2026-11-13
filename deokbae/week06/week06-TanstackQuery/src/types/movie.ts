export interface Genre {
  id: number;
  name: string;
}


export interface MovieListItem {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  release_date: string;
  poster_path: string | null;
  backdrop_path: string | null;
}


export interface MovieDetail {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  tagline: string;
  release_date: string;
  runtime: number | null;
  genres: Genre[];
  poster_path: string | null;
  backdrop_path: string | null;
}