package com.umc.movie.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record CreateFavoriteRequest(
        @Schema(description = "즐겨찾기할 영화 ID", example = "550") @NotNull @Positive Long movieId
) {}
