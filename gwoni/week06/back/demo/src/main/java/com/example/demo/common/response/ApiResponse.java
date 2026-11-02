package com.example.demo.common.response;

import com.example.demo.common.exception.ErrorStatus;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class ApiResponse<T> {

    @JsonProperty("isSuccess")
    private final boolean isSuccess;
    private final String code;
    private final String message;
    private final T result;

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
