package com.example.demo.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @NotBlank @Email @Size(max = 254) String email,
        // bcrypt는 72바이트까지만 사용함
        @NotBlank @Size(max = 72) String password,
        @NotBlank @Size(max = 50) String nickname
) {}
