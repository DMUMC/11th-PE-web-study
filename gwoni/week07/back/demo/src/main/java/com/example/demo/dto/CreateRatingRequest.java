package com.example.demo.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class CreateRatingRequest {

    @NotNull(message = "영화 ID를 입력해주세요.")
    private Long movieId;

    @NotNull(message = "별점을 입력해주세요.")
    private Integer score;

    private String comment;
}
