package com.umc.movie.dto;
import jakarta.validation.constraints.*;
public record FavoriteCreateRequest(@NotNull @Positive Long movieId) {}
