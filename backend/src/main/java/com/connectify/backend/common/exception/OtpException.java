package com.connectify.backend.common.exception;

import org.springframework.http.HttpStatus;

public class OtpException extends ApiException {

    public OtpException(ErrorCode errorCode, String message) {
        super(HttpStatus.BAD_REQUEST, errorCode, message);
    }
}
