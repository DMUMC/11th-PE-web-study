package com.example.demo.common.exception;

import com.example.demo.common.response.ApiResponse;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.exception.ConstraintViolationException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.web.ErrorResponse;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import java.util.Locale;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(GeneralException.class)
    public ResponseEntity<ApiResponse<Void>> handleGeneral(GeneralException exception) {
        return toResponse(exception.getStatus(), exception.getStatus().getMessage());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Void>> handleValidation(MethodArgumentNotValidException exception) {
        String message = exception.getBindingResult().getFieldErrors().stream()
                .findFirst()
                .map(FieldError::getDefaultMessage)
                .orElse(ErrorStatus.BAD_REQUEST.getMessage());
        return toResponse(ErrorStatus.BAD_REQUEST, message);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ApiResponse<Void>> handleUnreadable(HttpMessageNotReadableException exception) {
        return toResponse(ErrorStatus.INVALID_BODY, ErrorStatus.INVALID_BODY.getMessage());
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ApiResponse<Void>> handleTypeMismatch(MethodArgumentTypeMismatchException exception) {
        return toResponse(ErrorStatus.INVALID_PATH, ErrorStatus.INVALID_PATH.getMessage());
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ApiResponse<Void>> handleDataIntegrity(DataIntegrityViolationException exception) {
        ErrorStatus status = resolveConstraint(exception);
        log.warn("DB 제약 위반 → {}: {}", status.getCode(), exception.getMostSpecificCause().getMessage());
        return toResponse(status, status.getMessage());
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handleUnknown(Exception exception) {
        if (exception instanceof ErrorResponse errorResponse) {
            int status = errorResponse.getStatusCode().value();
            return ResponseEntity.status(status)
                    .body(ApiResponse.failure("COMMON" + status, errorResponse.getBody().getDetail()));
        }
        log.error("처리되지 않은 예외", exception);
        return toResponse(ErrorStatus.INTERNAL_ERROR, ErrorStatus.INTERNAL_ERROR.getMessage());
    }

    private ErrorStatus resolveConstraint(DataIntegrityViolationException exception) {
        String constraint = exception.getCause() instanceof ConstraintViolationException cve
                && cve.getConstraintName() != null
                ? cve.getConstraintName()
                : exception.getMostSpecificCause().getMessage();
        String name = constraint == null ? "" : constraint.toLowerCase(Locale.ROOT);

        if (name.contains("uk_member_email")) return ErrorStatus.MEMBER_EMAIL_DUPLICATED;
        if (name.contains("uk_member_nickname")) return ErrorStatus.MEMBER_NICKNAME_DUPLICATED;
        if (name.contains("uk_rating_member_movie")) return ErrorStatus.RATING_DUPLICATED;
        return ErrorStatus.DUPLICATE_DATA;
    }

    private ResponseEntity<ApiResponse<Void>> toResponse(ErrorStatus status, String message) {
        return ResponseEntity.status(status.getHttpStatus()).body(ApiResponse.failure(status, message));
    }
}
