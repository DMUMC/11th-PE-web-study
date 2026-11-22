package com.umc.movie.dto;

// 즐겨찾기를 함께 저장하지 않았다면 favorite는 null이다.
public record MovieRecordResponse(
        RatingResponse rating,
        FavoriteResponse favorite
) {
}
