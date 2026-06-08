package com.connectify.backend.common.exception;

import org.springframework.http.HttpStatus;

public class AlreadyExistsException extends ApiException {

    public AlreadyExistsException(String message) {
        super(HttpStatus.CONFLICT, ErrorCode.CONFLICT, message);
    }
}