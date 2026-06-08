package com.connectify.backend.auth.controller;

import com.connectify.backend.auth.dto.request.ChangePasswordRequest;
import com.connectify.backend.auth.dto.request.ForgotPasswordRequest;
import com.connectify.backend.auth.dto.request.LoginRequest;
import com.connectify.backend.auth.dto.request.RefreshTokenRequest;
import com.connectify.backend.auth.dto.request.RegisterRequest;
import com.connectify.backend.auth.dto.request.ResetPasswordRequest;
import com.connectify.backend.auth.dto.request.VerifyEmailRequest;
import com.connectify.backend.auth.dto.request.VerifyOtpRequest;
import com.connectify.backend.auth.dto.request.VerifyResetOtpRequest;
import com.connectify.backend.auth.dto.response.ForgotPasswordResponse;
import com.connectify.backend.auth.dto.response.LoginResponse;
import com.connectify.backend.auth.dto.response.RegisterResponse;
import com.connectify.backend.auth.dto.response.UserResponse;
import com.connectify.backend.auth.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.security.Principal;

@RestController
@RequestMapping("/api/auth/v1")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<RegisterResponse> register(@Valid @RequestBody RegisterRequest registerRequest) {
        return ResponseEntity.ok(authService.register(registerRequest));
    }

    @PostMapping("/verify-email")
    public ResponseEntity<UserResponse> verifyEmail(@Valid @RequestBody VerifyEmailRequest verifyEmailRequest) {
        return ResponseEntity.ok(authService.verifyEmail(verifyEmailRequest));
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest loginRequest) {
        return ResponseEntity.ok(authService.login(loginRequest));
    }

    @PostMapping("/verify-login-otp")
    public ResponseEntity<LoginResponse> verifyLoginOtp(@Valid @RequestBody VerifyOtpRequest verifyOtpRequest) {
        return ResponseEntity.ok(authService.verifyLoginOtp(verifyOtpRequest));
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<LoginResponse> refreshToken(@Valid @RequestBody RefreshTokenRequest refreshTokenRequest) {
        return ResponseEntity.ok(authService.refreshToken(refreshTokenRequest));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<ForgotPasswordResponse> forgotPassword(
            @Valid @RequestBody ForgotPasswordRequest forgotPasswordRequest
    ) {
        return ResponseEntity.ok(authService.forgotPassword(forgotPasswordRequest));
    }

    @PostMapping("/verify-reset-otp")
    public ResponseEntity<ForgotPasswordResponse> verifyResetOtp(
            @Valid @RequestBody VerifyResetOtpRequest verifyResetOtpRequest
    ) {
        return ResponseEntity.ok(authService.verifyResetOtp(verifyResetOtpRequest));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<ForgotPasswordResponse> resetPassword(
            @Valid @RequestBody ResetPasswordRequest resetPasswordRequest
    ) {
        return ResponseEntity.ok(authService.resetPassword(resetPasswordRequest));
    }

    @PostMapping("/change-password")
    public ResponseEntity<ForgotPasswordResponse> changePassword(
            Principal principal,
            @Valid @RequestBody ChangePasswordRequest changePasswordRequest
    ) {
        return ResponseEntity.ok(authService.changePassword(principal, changePasswordRequest));
    }
}
