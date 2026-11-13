import type {
  TmdbMovieListItem,
  TmdbMovieDetail,
} from "../api/movies/model";

export type Movie = TmdbMovieListItem | TmdbMovieDetail;