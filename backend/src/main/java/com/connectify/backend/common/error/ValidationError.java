package com.connectify.backend.common.error;

public record ValidationError(
        String field,
        String message
) {
}
