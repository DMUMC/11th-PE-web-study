package com.umc.movie.exception;
import com.umc.movie.dto.ApiResponse;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.server.ResponseStatusException;
@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(ApiException.class)
    public ResponseEntity<ApiResponse<Void>> business(ApiException e) {
        return ResponseEntity.status(e.getStatus()).body(ApiResponse.failure(e.getCode(), e.getMessage()));
    }
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Void>> validation(MethodArgumentNotValidException e) {
        // 거절된 입력값(특히 비밀번호)은 응답에 넣지 않습니다.
        String message = e.getBindingResult().getFieldErrors().stream()
                .map(error -> error.getField() + ": " + error.getDefaultMessage())
                .sorted().findFirst().orElse("입력값을 확인해 주세요.");
        return ResponseEntity.badRequest().body(ApiResponse.failure("COMMON400", message));
    }
    @ExceptionHandler({HttpMessageNotReadableException.class, MethodArgumentTypeMismatchException.class})
    public ResponseEntity<ApiResponse<Void>> malformed(Exception e) {
        return ResponseEntity.badRequest().body(ApiResponse.failure("COMMON400", "요청 형식과 숫자 타입을 확인해 주세요."));
    }
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ApiResponse<Void>> constraint(DataIntegrityViolationException e) {
        return ResponseEntity.status(409).body(ApiResponse.failure("COMMON409", "중복 데이터 또는 데이터 제약 조건 충돌입니다."));
    }
    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<ApiResponse<Void>> status(ResponseStatusException e) {
        return ResponseEntity.status(e.getStatusCode()).body(ApiResponse.failure(
                "COMMON" + e.getStatusCode().value(), e.getReason()));
    }
}
