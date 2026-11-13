package com.example.demo.dto;

public record LoginResponse(boolean success, Long memberId) {

    public static LoginResponse success(Long memberId) {
        return new LoginResponse(true, memberId);
    }

    public static LoginResponse fail() {
        return new LoginResponse(false, null);
    }
}
