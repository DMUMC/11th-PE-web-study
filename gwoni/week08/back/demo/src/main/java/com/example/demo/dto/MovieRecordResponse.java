package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class MovieRecordResponse {

    private final RatingResponse rating;
    // addToFavorites가 false면 null
    private final FavoriteResponse favorite;
}
