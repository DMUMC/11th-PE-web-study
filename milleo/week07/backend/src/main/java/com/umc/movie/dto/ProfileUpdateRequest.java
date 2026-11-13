package com.umc.movie.dto;
import jakarta.validation.constraints.*;
public record ProfileUpdateRequest(@Email @Size(max=254) String email,
    @NotBlank @Size(min=2,max=12) String nickname, @Size(max=150) String introduction) {}
