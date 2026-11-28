package com.umc.movie.dto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;
public record LoginRequest(@NotBlank @Email @Schema(description = "가입한 이메일", example = "doeyat@example.com") String email, @NotBlank @Size(max=72) @Schema(description = "가입 시 설정한 비밀번호", example = "Umc!1234") String password) {}
