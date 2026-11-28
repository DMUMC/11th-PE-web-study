package com.umc.movie.dto;
import jakarta.validation.constraints.*;
public record FavoriteRequest(@NotNull @Positive Long movieId) {}
