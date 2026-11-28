package com.umc.movie.dto;

import com.umc.movie.entity.Favorite;

public record FavoriteResponse(Long favoriteId, Long movieId) {
    public static FavoriteResponse from(Favorite favorite) {
        return new FavoriteResponse(favorite.getFavoriteId(), favorite.getMovieId());
    }
}
