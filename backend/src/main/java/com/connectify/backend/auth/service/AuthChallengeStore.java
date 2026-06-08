package com.connectify.backend.auth.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.time.Instant;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

@Component
@Slf4j
public class AuthChallengeStore {

    private final ConcurrentMap<String, StoredChallenge> emailVerificationTokens = new ConcurrentHashMap<>();
    private final ConcurrentMap<String, StoredChallenge> loginOtpsByEmail = new ConcurrentHashMap<>();
    private final ConcurrentMap<String, StoredChallenge> resetOtpsByEmail = new ConcurrentHashMap<>();
    private final ConcurrentMap<String, StoredChallenge> resetTokens = new ConcurrentHashMap<>();

    public String createEmailVerificationToken(Long userId, Duration ttl) {
        String token = UUID.randomUUID().toString().replace("-", "");
        emailVerificationTokens.put(token, new StoredChallenge(userId, token, Instant.now().plus(ttl)));
        return token;
    }

    public Optional<Long> consumeEmailVerificationToken(String token) {
        return consume(emailVerificationTokens, token);
    }

    public String createLoginOtp(String email, Long userId, String otp, Duration ttl) {
        loginOtpsByEmail.put(normalize(email), new StoredChallenge(userId, otp, Instant.now().plus(ttl)));
        return otp;
    }

    public Optional<Long> consumeLoginOtp(String email, String otp) {
        return consume(loginOtpsByEmail, normalize(email), otp);
    }

    public String createResetOtp(String email, Long userId, String otp, Duration ttl) {
        resetOtpsByEmail.put(normalize(email), new StoredChallenge(userId, otp, Instant.now().plus(ttl)));
        return otp;
    }

    public Optional<Long> consumeResetOtp(String email, String otp) {
        return consume(resetOtpsByEmail, normalize(email), otp);
    }

    public String createResetToken(Long userId, Duration ttl) {
        String token = UUID.randomUUID().toString().replace("-", "");
        resetTokens.put(token, new StoredChallenge(userId, token, Instant.now().plus(ttl)));
        return token;
    }

    public Optional<Long> consumeResetToken(String token) {
        return consume(resetTokens, token);
    }

    private Optional<Long> consume(ConcurrentMap<String, StoredChallenge> store, String key) {
        StoredChallenge challenge = store.get(key);
        if (challenge == null) {
            return Optional.empty();
        }
        if (challenge.isExpired()) {
            store.remove(key);
            return Optional.empty();
        }
        store.remove(key);
        return Optional.of(challenge.userId());
    }

    private Optional<Long> consume(ConcurrentMap<String, StoredChallenge> store, String key, String code) {
        StoredChallenge challenge = store.get(key);
        if (challenge == null) {
            return Optional.empty();
        }
        if (challenge.isExpired()) {
            store.remove(key);
            return Optional.empty();
        }
        if (!challenge.code().equals(code)) {
            return Optional.empty();
        }
        store.remove(key);
        return Optional.of(challenge.userId());
    }

    private String normalize(String value) {
        return value == null ? null : value.trim().toLowerCase();
    }

    private record StoredChallenge(Long userId, String code, Instant expiresAt) {
        boolean isExpired() {
            return Instant.now().isAfter(expiresAt);
        }
    }
}
