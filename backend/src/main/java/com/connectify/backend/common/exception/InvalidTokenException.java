package com.connectify.backend.common.exception;

import org.springframework.http.HttpStatus;

public class InvalidTokenException extends ApiException {

    public InvalidTokenException(String message) {
        super(HttpStatus.BAD_REQUEST, ErrorCode.INVALID_TOKEN, message);
    }
}
