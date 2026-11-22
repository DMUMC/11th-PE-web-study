package com.example.demo.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class CreateMovieRecordRequest {

    @NotNull(message = "영화 ID는 필수입니다.")
    @Positive(message = "영화 ID는 양수여야 합니다.")
    private Long movieId;

    @NotNull(message = "별점은 필수입니다.")
    @Min(value = 1, message = "별점은 1점 이상이어야 합니다.")
    @Max(value = 5, message = "별점은 5점 이하여야 합니다.")
    private Integer score;

    private String comment;

    @NotNull(message = "즐겨찾기 추가 여부는 필수입니다.")
    private Boolean addToFavorites;
}
