// src/main/java/com/umc/movie/dto/CreateFavoriteRequest.java
package com.umc.movie.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import io.swagger.v3.oas.annotations.media.Schema;

public record CreateFavoriteRequest(
        @NotNull(message = "영화 ID는 필수입니다.")
        @Positive(message = "영화 ID는 양수여야 합니다.")
        @Schema(description = "Movie ID", example = "550")
        Long movieId
) {
}
