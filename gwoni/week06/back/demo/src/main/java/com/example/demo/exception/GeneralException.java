package com.example.demo.exception;

import lombok.Getter;

// 서비스에서 업무 규칙 위반을 알릴 때 던지는 예외. 응답 변환은 GlobalExceptionHandler가 담당
@Getter
public class GeneralException extends RuntimeException {

    private final ErrorStatus status;

    public GeneralException(ErrorStatus status) {
        super(status.getMessage());
        this.status = status;
    }
}
