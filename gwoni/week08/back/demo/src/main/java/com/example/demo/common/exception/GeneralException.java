package com.example.demo.common.exception;

import lombok.Getter;

@Getter
public class GeneralException extends RuntimeException {

    private final ErrorStatus status;

    public GeneralException(ErrorStatus status) {
        super(status.getMessage());
        this.status = status;
    }
}
