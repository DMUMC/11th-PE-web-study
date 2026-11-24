package com.umc.movie.dto;

// 성공과 실패 응답을 같은 모양으로 맞춘다.
public record ApiResponse<T>(boolean isSuccess, String code, String message, T result) {

    public static <T> ApiResponse<T> created(String message, T result) {
        return new ApiResponse<>(true, "COMMON201", message, result);
    }

    public static <T> ApiResponse<T> ok(String message, T result) {
        return new ApiResponse<>(true, "COMMON200", message, result);
    }

    public static ApiResponse<Void> failure(String code, String message) {
        return new ApiResponse<>(false, code, message, null);
    }
}
