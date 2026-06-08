package com.connectify.backend.common.error;

import com.connectify.backend.common.exception.ErrorCode;

import java.time.Instant;
import java.util.List;

public record ApiErrorResponse(
        Instant timestamp,
        int status,
        String error,
        ErrorCode code,
        String message,
        String path,
        List<ValidationError> validationErrors
) {
    public static ApiErrorResponse of(
            int status,
            String error,
            ErrorCode code,
            String message,
            String path
    ) {
        return new ApiErrorResponse(Instant.now(), status, error, code, message, path, List.of());
    }

    public static ApiErrorResponse validation(
            int status,
            String error,
            String message,
            String path,
            List<ValidationError> validationErrors
    ) {
        return new ApiErrorResponse(
                Instant.now(),
                status,
                error,
                ErrorCode.VALIDATION_FAILED,
                message,
                path,
                validationErrors
        );
    }
}
