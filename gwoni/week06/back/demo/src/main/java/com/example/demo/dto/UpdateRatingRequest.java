package com.example.demo.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class UpdateRatingRequest {

    @NotNull(message = "별점을 입력해주세요.")
    private Integer score;

    private String comment;
}
