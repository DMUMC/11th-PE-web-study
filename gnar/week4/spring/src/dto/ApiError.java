package com.example.demo.dto;

public record ApiError(
        int status,
        String message
) {
}