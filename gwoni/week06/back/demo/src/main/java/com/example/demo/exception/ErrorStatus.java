package com.example.demo.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum ErrorStatus {

    // 공통
    BAD_REQUEST(HttpStatus.BAD_REQUEST, "COMMON4001", "잘못된 요청입니다."),
    INVALID_BODY(HttpStatus.BAD_REQUEST, "COMMON4002", "요청 본문 형식이 올바르지 않습니다."),
    INVALID_PATH(HttpStatus.BAD_REQUEST, "COMMON4003", "요청 경로의 값 형식이 올바르지 않습니다."),
    DUPLICATE_DATA(HttpStatus.CONFLICT, "COMMON4091", "이미 존재하는 데이터입니다."),
    INTERNAL_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "COMMON500", "서버 오류가 발생했습니다."),

    // 회원
    MEMBER_NOT_FOUND(HttpStatus.NOT_FOUND, "MEMBER4041", "존재하지 않는 유저입니다."),
    MEMBER_EMAIL_DUPLICATED(HttpStatus.CONFLICT, "MEMBER4091", "이미 사용 중인 이메일입니다."),
    MEMBER_NICKNAME_DUPLICATED(HttpStatus.CONFLICT, "MEMBER4092", "이미 사용 중인 닉네임입니다."),

    // 평점
    RATING_FORBIDDEN(HttpStatus.FORBIDDEN, "RATING4031", "본인이 작성한 평점만 수정하거나 삭제할 수 있습니다."),
    RATING_NOT_FOUND(HttpStatus.NOT_FOUND, "RATING4041", "존재하지 않는 평점입니다."),
    RATING_DUPLICATED(HttpStatus.CONFLICT, "RATING4091", "이미 이 영화에 평점을 남기셨습니다.");

    private final HttpStatus httpStatus;
    private final String code;
    private final String message;
}
