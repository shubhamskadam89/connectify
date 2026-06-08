package com.connectify.backend.common.exception;

import org.springframework.http.HttpStatus;

public class TokenExpiredException extends ApiException {

    public TokenExpiredException(String message) {
        super(HttpStatus.BAD_REQUEST, ErrorCode.TOKEN_EXPIRED, message);
    }
}
