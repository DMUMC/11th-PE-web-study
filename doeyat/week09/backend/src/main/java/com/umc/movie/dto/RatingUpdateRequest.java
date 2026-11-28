package com.umc.movie.dto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;
public record RatingUpdateRequest(
        @NotNull @Min(1) @Max(5) @Schema(description = "수정할 평점: 1~5 정수", example = "4") Integer score,
        @Size(max = 500) @Schema(description = "수정할 감상: 최대 500자", example = "두 번째 감상") String comment
) {}
