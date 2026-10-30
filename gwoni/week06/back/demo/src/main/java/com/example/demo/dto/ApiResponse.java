package com.example.demo.dto;

import com.example.demo.exception.ErrorStatus;
import com.fasterxml.jackson.annotation.JsonProperty;

// 6주차부터 쓰기 API의 성공/실패 응답을 같은 틀로 맞춤
// boolean의 is 접두사가 JSON 필드명에서 빠지지 않도록 이름을 고정
public record ApiResponse<T>(@JsonProperty("isSuccess") boolean isSuccess, String code, String message, T result) {

    public static <T> ApiResponse<T> ok(String message, T result) {
        return new ApiResponse<>(true, "COMMON200", message, result);
    }

    public static <T> ApiResponse<T> created(String message, T result) {
        return new ApiResponse<>(true, "COMMON201", message, result);
    }

    public static ApiResponse<Void> failure(ErrorStatus status) {
        return failure(status, status.getMessage());
    }

    public static ApiResponse<Void> failure(ErrorStatus status, String message) {
        return failure(status.getCode(), message);
    }

    public static ApiResponse<Void> failure(String code, String message) {
        return new ApiResponse<>(false, code, message, null);
    }
}
