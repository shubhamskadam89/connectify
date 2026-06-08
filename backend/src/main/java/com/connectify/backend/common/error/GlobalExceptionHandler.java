package com.connectify.backend.common.error;

import com.connectify.backend.common.exception.ApiException;
import com.connectify.backend.common.exception.ErrorCode;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.servlet.NoHandlerFoundException;

import java.util.List;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ApiException.class)
    public ResponseEntity<ApiErrorResponse> handleApiException(
            ApiException exception,
            HttpServletRequest request
    ) {
        HttpStatus status = exception.getStatus();
        ApiErrorResponse response = ApiErrorResponse.of(
                status.value(),
                status.getReasonPhrase(),
                exception.getErrorCode(),
                exception.getMessage(),
                request.getRequestURI()
        );

        return ResponseEntity.status(status).body(response);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiErrorResponse> handleMethodArgumentNotValidException(
            MethodArgumentNotValidException exception,
            HttpServletRequest request
    ) {
        HttpStatus status = HttpStatus.BAD_REQUEST;
        List<ValidationError> validationErrors = exception.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(this::toValidationError)
                .toList();

        ApiErrorResponse response = ApiErrorResponse.validation(
                status.value(),
                status.getReasonPhrase(),
                "Request validation failed",
                request.getRequestURI(),
                validationErrors
        );

        return ResponseEntity.status(status).body(response);
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ApiErrorResponse> handleConstraintViolationException(
            ConstraintViolationException exception,
            HttpServletRequest request
    ) {
        HttpStatus status = HttpStatus.BAD_REQUEST;
        List<ValidationError> validationErrors = exception.getConstraintViolations()
                .stream()
                .map(violation -> new ValidationError(
                        violation.getPropertyPath().toString(),
                        violation.getMessage()
                ))
                .toList();

        ApiErrorResponse response = ApiErrorResponse.validation(
                status.value(),
                status.getReasonPhrase(),
                "Request validation failed",
                request.getRequestURI(),
                validationErrors
        );

        return ResponseEntity.status(status).body(response);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ApiErrorResponse> handleHttpMessageNotReadableException(
            HttpMessageNotReadableException exception,
            HttpServletRequest request
    ) {
        return buildResponse(
                HttpStatus.BAD_REQUEST,
                ErrorCode.BAD_REQUEST,
                "Request body is missing or malformed",
                request
        );
    }

    @ExceptionHandler(MissingServletRequestParameterException.class)
    public ResponseEntity<ApiErrorResponse> handleMissingServletRequestParameterException(
            MissingServletRequestParameterException exception,
            HttpServletRequest request
    ) {
        return buildResponse(
                HttpStatus.BAD_REQUEST,
                ErrorCode.BAD_REQUEST,
                "Missing required parameter: " + exception.getParameterName(),
                request
        );
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ApiErrorResponse> handleMethodArgumentTypeMismatchException(
            MethodArgumentTypeMismatchException exception,
            HttpServletRequest request
    ) {
        return buildResponse(
                HttpStatus.BAD_REQUEST,
                ErrorCode.BAD_REQUEST,
                "Invalid value for parameter: " + exception.getName(),
                request
        );
    }

    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public ResponseEntity<ApiErrorResponse> handleHttpRequestMethodNotSupportedException(
            HttpRequestMethodNotSupportedException exception,
            HttpServletRequest request
    ) {
        return buildResponse(
                HttpStatus.METHOD_NOT_ALLOWED,
                ErrorCode.BAD_REQUEST,
                "HTTP method is not supported for this endpoint",
                request
        );
    }

    @ExceptionHandler(NoHandlerFoundException.class)
    public ResponseEntity<ApiErrorResponse> handleNoHandlerFoundException(
            NoHandlerFoundException exception,
            HttpServletRequest request
    ) {
        return buildResponse(
                HttpStatus.NOT_FOUND,
                ErrorCode.NOT_FOUND,
                "Endpoint not found",
                request
        );
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiErrorResponse> handleException(
            Exception exception,
            HttpServletRequest request
    ) {
        return buildResponse(
                HttpStatus.INTERNAL_SERVER_ERROR,
                ErrorCode.INTERNAL_SERVER_ERROR,
                "Something went wrong. Please try again later.",
                request
        );
    }

    private ValidationError toValidationError(FieldError fieldError) {
        return new ValidationError(fieldError.getField(), fieldError.getDefaultMessage());
    }

    private ResponseEntity<ApiErrorResponse> buildResponse(
            HttpStatus status,
            ErrorCode errorCode,
            String message,
            HttpServletRequest request
    ) {
        ApiErrorResponse response = ApiErrorResponse.of(
                status.value(),
                status.getReasonPhrase(),
                errorCode,
                message,
                request.getRequestURI()
        );

        return ResponseEntity.status(status).body(response);
    }
}
