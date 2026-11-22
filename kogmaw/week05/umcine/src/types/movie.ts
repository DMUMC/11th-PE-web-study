export interface MovieSummary {
  id: number;
  title: string;
  original_title: string;
  release_date: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
}

export interface MovieDetail extends MovieSummary {
  genres: { id: number; name: string }[];
  runtime: number | null;
  tagline: string;
}

export interface MoviePage {
  page: number;
  results: MovieSummary[];
  total_pages: number;
  total_results: number;
}
