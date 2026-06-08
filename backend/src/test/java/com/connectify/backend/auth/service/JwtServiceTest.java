package com.connectify.backend.auth.service;

import com.connectify.backend.user.entity.Role;
import com.connectify.backend.user.entity.User;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

class JwtServiceTest {

    @Test
    void generateAccessTokenReturnsValidSignedToken() {
        JwtService jwtService = new JwtService(new ObjectMapper(), "test-secret-value", 900);
        User user = User.builder()
                .id(1L)
                .email("user@example.com")
                .username("user")
                .role(Role.USER)
                .build();

        String token = jwtService.generateAccessToken(user);

        assertThat(jwtService.isValid(token)).isTrue();
        assertThat(jwtService.extractSubject(token)).contains("user@example.com");
    }

    @Test
    void extractSubjectReturnsEmptyForTamperedToken() {
        JwtService jwtService = new JwtService(new ObjectMapper(), "test-secret-value", 900);
        User user = User.builder()
                .id(1L)
                .email("user@example.com")
                .username("user")
                .role(Role.USER)
                .build();
        String token = jwtService.generateAccessToken(user);
        String tamperedToken = token.substring(0, token.length() - 4) + "abcd";

        Optional<String> subject = jwtService.extractSubject(tamperedToken);

        assertThat(subject).isEmpty();
        assertThat(jwtService.isValid(tamperedToken)).isFalse();
    }
}
