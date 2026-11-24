package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class LoginResponse {

    private final boolean success;
    private final Long memberId;

    public static LoginResponse success(Long memberId) {
        return new LoginResponse(true, memberId);
    }

    public static LoginResponse fail() {
        return new LoginResponse(false, null);
    }
}
