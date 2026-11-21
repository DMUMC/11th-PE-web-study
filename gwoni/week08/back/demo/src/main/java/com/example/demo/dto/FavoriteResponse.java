package com.example.demo.dto;

import com.example.demo.entity.Favorite;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class FavoriteResponse {

    private final Long favoriteId;
    private final Long movieId;
    private final LocalDateTime createdAt;

    public static FavoriteResponse from(Favorite favorite) {
        return new FavoriteResponse(
                favorite.getFavoriteId(),
                favorite.getMovieId(),
                favorite.getCreatedAt()
        );
    }
}
