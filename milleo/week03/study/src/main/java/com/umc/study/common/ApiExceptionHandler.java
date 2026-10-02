package com.umc.study.common;

import java.util.Map;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestControllerAdvice
public class ApiExceptionHandler {
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
