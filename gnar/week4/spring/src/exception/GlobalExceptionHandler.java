package com.example.demo.exception;

import com.example.demo.dto.ApiError;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiError> handleValidation(
            MethodArgumentNotValidException exception
    ) {
        String message = exception.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(error ->
                        error.getField() + ": " + error.getDefaultMessage()
                )
                .distinct()
                .collect(Collectors.joining(", "));

        return ResponseEntity.badRequest()
                .body(new ApiError(400, message));
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ApiError> handleInvalidJson(
            HttpMessageNotReadableException exception
    ) {
        return ResponseEntity.badRequest()
                .body(new ApiError(
                        400,
                        "JSON 형식이나 필드의 데이터 타입을 확인하세요."
                ));
    }

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<ApiError> handleStatus(
            ResponseStatusException exception
    ) {
        String message = exception.getReason() != null
                ? exception.getReason()
                : "요청을 처리할 수 없습니다.";

        return ResponseEntity.status(exception.getStatusCode())
                .body(new ApiError(
                        exception.getStatusCode().value(),
                        message
                ));
    }
}