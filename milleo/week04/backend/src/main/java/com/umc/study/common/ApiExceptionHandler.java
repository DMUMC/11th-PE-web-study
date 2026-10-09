package com.umc.study.common;

import java.util.Map;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestControllerAdvice
public class ApiExceptionHandler {
    @ExceptionHandler(org.springframework.web.bind.MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Map<String, Object> handleValidation(org.springframework.web.bind.MethodArgumentNotValidException ex) {
        Map<String, String> errors = new java.util.LinkedHashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(error ->
                errors.putIfAbsent(error.getField(), error.getDefaultMessage()));
        return Map.of("status", 400, "message", "요청값을 확인해주세요.", "errors", errors);
    }

    @ExceptionHandler(org.springframework.http.converter.HttpMessageNotReadableException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Map<String, Object> handleMalformedJson(org.springframework.http.converter.HttpMessageNotReadableException ex) {
        return Map.of("status", 400, "message", "JSON 요청 본문을 확인해주세요.");
    }

    @ExceptionHandler(ResponseStatusException.class)
    public org.springframework.http.ResponseEntity<Map<String, Object>> handleRequest(ResponseStatusException ex) {
        return org.springframework.http.ResponseEntity.status(ex.getStatusCode())
                .body(Map.of("status", ex.getStatusCode().value(), "message", ex.getReason()));
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Map<String, Object> handleInvalidReference(DataIntegrityViolationException ex) {
        return Map.of("status", 400, "message", "userId와 bookId가 DB에 존재하는지 확인해주세요.");
    }
}
