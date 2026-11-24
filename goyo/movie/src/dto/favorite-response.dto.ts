
import { Favorite } from '../entity/favorite.enttity.js';

export class FavoriteResponseDto {
  favoriteId!: number;
  movieId!: number;

  static from(favorite: Favorite): FavoriteResponseDto {
    return {
      favoriteId: favorite.favoriteId,
      movieId: favorite.movieId,
    };
  }
}
