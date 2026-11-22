package com.umc.movie.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

// 서비스나 인터셉터 안쪽에서 상태 코드와 code를 함께 던진다. 전역 처리기가 공통 응답으로 바꾼다.
@Getter
public class ApiException extends RuntimeException {

    private final HttpStatus status;
    private final String code;

    public ApiException(HttpStatus status, String code, String message) {
        super(message);
        this.status = status;
        this.code = code;
    }
}
