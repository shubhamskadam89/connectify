package com.connectify.backend.auth.service;

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
import com.connectify.backend.common.exception.AlreadyExistsException;
import com.connectify.backend.common.exception.ErrorCode;
import com.connectify.backend.common.exception.ForbiddenException;
import com.connectify.backend.common.exception.InvalidTokenException;
import com.connectify.backend.common.exception.OtpException;
import com.connectify.backend.common.exception.ResourceNotFoundException;
import com.connectify.backend.common.exception.UnauthorizedException;
import com.connectify.backend.user.entity.Role;
import com.connectify.backend.user.entity.User;
import com.connectify.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.Principal;
import java.time.Duration;
import java.util.Optional;
import java.util.concurrent.ThreadLocalRandom;

@Service
@Slf4j
@RequiredArgsConstructor
public class AuthService {

    private static final Duration EMAIL_VERIFICATION_TTL = Duration.ofHours(24);
    private static final Duration LOGIN_OTP_TTL = Duration.ofMinutes(10);
    private static final Duration RESET_OTP_TTL = Duration.ofMinutes(10);
    private static final Duration RESET_TOKEN_TTL = Duration.ofMinutes(15);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailVerificationService emailVerificationService;
    private final AuthChallengeStore authChallengeStore;
    private final JwtService jwtService;
    private final RefreshTokenService refreshTokenService;

    @Transactional
    public RegisterResponse register(RegisterRequest request) {
        log.info("Register request received for email={}, username={}", request.getEmail(), request.getUsername());

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new AlreadyExistsException("Email is already registered");
        }

        if (userRepository.existsByUsername(request.getUsername())) {
            throw new AlreadyExistsException("Username is already taken");
        }

        User user = User.builder()
                .email(request.getEmail())
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .role(Role.USER)
                .emailVerified(false)
                .build();

        user = userRepository.save(user);

        String verificationToken = authChallengeStore.createEmailVerificationToken(user.getId(), EMAIL_VERIFICATION_TTL);
        emailVerificationService.sendVerificationEmail(user, verificationToken);

        log.info("User registered successfully, verification token created for userId={}, email={}", user.getId(), user.getEmail());

        return RegisterResponse.builder()
                .message("Registration successful. Please verify your email.")
                .email(user.getEmail())
                .username(user.getUsername())
                .emailVerificationRequired(true)
                .build();
    }

    @Transactional
    public UserResponse verifyEmail(VerifyEmailRequest request) {
        log.info("Verify email request received");

        Long userId = authChallengeStore.consumeEmailVerificationToken(request.getToken())
                .orElseThrow(() -> new InvalidTokenException("Invalid verification token"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        user.setEmailVerified(true);
        user = userRepository.save(user);

        log.info("Email verified for userId={}, email={}", user.getId(), user.getEmail());
        return toUserResponse(user);
    }

    @Transactional
    public LoginResponse login(LoginRequest request) {
        log.info("Login request received for identifier={}", request.getIdentifier());

        User user = resolveUser(request.getIdentifier());

        if (!user.isEmailVerified()) {
            throw new ForbiddenException("Please verify your email before logging in");
        }

        if (hasText(request.getPassword())) {
            if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
                throw new UnauthorizedException("Invalid credentials");
            }

            log.info("Password login successful for userId={}, email={}", user.getId(), user.getEmail());
            return buildSuccessLoginResponse(user);
        }

        String otp = generateOtp();
        authChallengeStore.createLoginOtp(user.getEmail(), user.getId(), otp, LOGIN_OTP_TTL);
        emailVerificationService.sendLoginOtp(user, otp);

        log.info("Login OTP issued for userId={}, email={}", user.getId(), user.getEmail());

        return LoginResponse.builder()
                .message("OTP sent to your email")
                .otpRequired(true)
                .user(toUserResponse(user))
                .build();
    }

    @Transactional
    public LoginResponse verifyLoginOtp(VerifyOtpRequest request) {
        log.info("Verify login OTP request received for email={}", request.getEmail());

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UnauthorizedException("Invalid credentials"));

        if (!user.isEmailVerified()) {
            throw new ForbiddenException("Please verify your email before logging in");
        }

        Long userId = authChallengeStore.consumeLoginOtp(request.getEmail(), request.getOtp())
                .orElseThrow(() -> new OtpException(ErrorCode.OTP_INVALID, "Invalid login OTP"));

        if (!userId.equals(user.getId())) {
            throw new OtpException(ErrorCode.OTP_INVALID, "Invalid login OTP");
        }

        log.info("Login OTP verified for userId={}, email={}", user.getId(), user.getEmail());
        return buildSuccessLoginResponse(user);
    }

    @Transactional
    public LoginResponse refreshToken(RefreshTokenRequest request) {
        log.info("Refresh token request received");

        User user = refreshTokenService.rotate(request.getRefreshToken());
        String newRefreshToken = refreshTokenService.create(user);

        log.info("Refresh token rotated for userId={}, email={}", user.getId(), user.getEmail());
        return LoginResponse.builder()
                .message("Token refreshed successfully")
                .otpRequired(false)
                .accessToken(jwtService.generateAccessToken(user))
                .refreshToken(newRefreshToken)
                .user(toUserResponse(user))
                .build();
    }

    @Transactional
    public ForgotPasswordResponse forgotPassword(ForgotPasswordRequest request) {
        log.info("Forgot password request received for email={}", request.getEmail());

        Optional<User> userOptional = userRepository.findByEmail(request.getEmail());
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            String otp = generateOtp();
            authChallengeStore.createResetOtp(user.getEmail(), user.getId(), otp, RESET_OTP_TTL);
            emailVerificationService.sendPasswordResetOtp(user, otp);
            log.info("Password reset OTP issued for userId={}, email={}", user.getId(), user.getEmail());
        } else {
            log.info("Forgot password requested for unknown email={}", request.getEmail());
        }

        return ForgotPasswordResponse.builder()
                .message("If the account exists, a reset OTP has been sent.")
                .build();
    }

    @Transactional
    public ForgotPasswordResponse verifyResetOtp(VerifyResetOtpRequest request) {
        log.info("Verify reset OTP request received for email={}", request.getEmail());

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new InvalidTokenException("Invalid reset OTP"));

        Long userId = authChallengeStore.consumeResetOtp(request.getEmail(), request.getOtp())
                .orElseThrow(() -> new OtpException(ErrorCode.OTP_INVALID, "Invalid reset OTP"));

        if (!userId.equals(user.getId())) {
            throw new OtpException(ErrorCode.OTP_INVALID, "Invalid reset OTP");
        }

        String resetToken = authChallengeStore.createResetToken(user.getId(), RESET_TOKEN_TTL);
        log.info("Reset OTP verified for userId={}, email={}, resetToken={}", user.getId(), user.getEmail(), resetToken);

        return ForgotPasswordResponse.builder()
                .message("OTP verified. You can now reset your password.")
                .resetToken(resetToken)
                .build();
    }

    @Transactional
    public ForgotPasswordResponse resetPassword(ResetPasswordRequest request) {
        log.info("Reset password request received");

        Long userId = authChallengeStore.consumeResetToken(request.getResetToken())
                .orElseThrow(() -> new InvalidTokenException("Invalid reset token"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
        refreshTokenService.revokeAll(user);

        log.info("Password reset successfully for userId={}, email={}", user.getId(), user.getEmail());

        return ForgotPasswordResponse.builder()
                .message("Password reset successfully.")
                .build();
    }

    @Transactional
    public ForgotPasswordResponse changePassword(Principal principal, ChangePasswordRequest request) {
        if (principal == null || principal.getName() == null || principal.getName().isBlank()) {
            throw new UnauthorizedException("You must be authenticated to change your password");
        }

        User user = resolveUser(principal.getName());

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new UnauthorizedException("Current password is incorrect");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
        refreshTokenService.revokeAll(user);

        log.info("Password changed successfully for userId={}, email={}", user.getId(), user.getEmail());

        return ForgotPasswordResponse.builder()
                .message("Password changed successfully.")
                .build();
    }

    private LoginResponse buildSuccessLoginResponse(User user) {
        return LoginResponse.builder()
                .message("Login successful")
                .otpRequired(false)
                .accessToken(jwtService.generateAccessToken(user))
                .refreshToken(refreshTokenService.create(user))
                .user(toUserResponse(user))
                .build();
    }

    private User resolveUser(String identifier) {
        return userRepository.findByEmail(identifier)
                .or(() -> userRepository.findByUsername(identifier))
                .orElseThrow(() -> new UnauthorizedException("Invalid credentials"));
    }

    private UserResponse toUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .username(user.getUsername())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .role(user.getRole())
                .build();
    }

    private String generateOtp() {
        int value = ThreadLocalRandom.current().nextInt(100000, 1000000);
        return Integer.toString(value);
    }

    private boolean hasText(String value) {
        return value != null && !value.isBlank();
    }
}
