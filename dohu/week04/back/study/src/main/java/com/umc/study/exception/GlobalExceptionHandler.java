package com.umc.study.exception;

import com.umc.study.dto.ErrorResponse;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

	// 요청 DTO 검증에 실패하면 첫 번째 오류 메시지를 400으로 돌려준다.
	@ExceptionHandler(MethodArgumentNotValidException.class)
	@ResponseStatus(HttpStatus.BAD_REQUEST)
	public ErrorResponse handleValidation(MethodArgumentNotValidException exception) {
		String message = exception.getBindingResult().getFieldErrors().stream()
				.findFirst()
				.map(error -> error.getDefaultMessage())
				.orElse("잘못된 요청입니다.");

		return new ErrorResponse(HttpStatus.BAD_REQUEST.value(), message);
	}

	@ExceptionHandler(CategoryNotFoundException.class)
	@ResponseStatus(HttpStatus.NOT_FOUND)
	public ErrorResponse handleCategoryNotFound(CategoryNotFoundException exception) {
		return new ErrorResponse(HttpStatus.NOT_FOUND.value(), exception.getMessage());
	}
}
