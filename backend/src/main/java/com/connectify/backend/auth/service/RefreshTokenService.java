package com.connectify.backend.auth.service;

import com.connectify.backend.auth.entity.RefreshToken;
import com.connectify.backend.auth.repository.RefreshTokenRepository;
import com.connectify.backend.common.exception.InvalidTokenException;
import com.connectify.backend.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.LocalDateTime;
import java.util.HexFormat;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RefreshTokenService {

    private final RefreshTokenRepository refreshTokenRepository;

    @Value("${JWT_REFRESH_TOKEN_TTL_DAYS:7}")
    private long refreshTokenTtlDays;

    @Transactional
    public String create(User user) {
        String rawToken = UUID.randomUUID().toString().replace("-", "") + UUID.randomUUID().toString().replace("-", "");
        RefreshToken refreshToken = RefreshToken.builder()
                .user(user)
                .tokenHash(hash(rawToken))
                .expiresAt(LocalDateTime.now().plusDays(refreshTokenTtlDays))
                .revoked(false)
                .build();

        refreshTokenRepository.save(refreshToken);
        return rawToken;
    }

    @Transactional
    public User rotate(String rawToken) {
        RefreshToken refreshToken = refreshTokenRepository.findByTokenHash(hash(rawToken))
                .orElseThrow(() -> new InvalidTokenException("Invalid refresh token"));

        if (!refreshToken.isActive()) {
            throw new InvalidTokenException("Invalid refresh token");
        }

        refreshToken.setRevoked(true);
        refreshTokenRepository.save(refreshToken);
        return refreshToken.getUser();
    }

    @Transactional
    public void revokeAll(User user) {
        refreshTokenRepository.deleteByUser(user);
    }

    private String hash(String value) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(value.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hash);
        } catch (Exception ex) {
            throw new IllegalStateException("Could not hash refresh token", ex);
        }
    }
}
