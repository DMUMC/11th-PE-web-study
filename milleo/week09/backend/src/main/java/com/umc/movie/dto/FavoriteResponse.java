package com.umc.movie.dto;
import com.umc.movie.entity.Favorite;
import java.time.LocalDateTime;
public record FavoriteResponse(Long favoriteId,Long movieId,LocalDateTime createdAt) {
    public static FavoriteResponse from(Favorite f) { return new FavoriteResponse(f.getFavoriteId(),f.getMovieId(),f.getCreatedAt()); }
}
