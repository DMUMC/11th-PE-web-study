package com.umc.movie.dto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;
public record RatingCreateRequest(
        @NotNull @Positive @Schema(description = "영화 ID", example = "550") Long movieId,
        @NotNull @Min(1) @Max(5) @Schema(description = "평점: 1~5 정수", example = "5") Integer score,
        @Size(max = 500) @Schema(description = "감상: 최대 500자", example = "다시 보고 싶은 영화") String comment
) {}
