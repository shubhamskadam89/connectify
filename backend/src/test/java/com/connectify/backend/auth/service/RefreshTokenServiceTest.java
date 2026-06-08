package com.connectify.backend.auth.service;

import com.connectify.backend.auth.entity.RefreshToken;
import com.connectify.backend.auth.repository.RefreshTokenRepository;
import com.connectify.backend.common.exception.InvalidTokenException;
import com.connectify.backend.user.entity.Role;
import com.connectify.backend.user.entity.User;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import java.lang.reflect.Proxy;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class RefreshTokenServiceTest {

    @Test
    void createStoresHashedTokenAndReturnsRawToken() {
        InMemoryRefreshTokenRepository repository = new InMemoryRefreshTokenRepository();
        RefreshTokenService service = newService(repository);
        ReflectionTestUtils.setField(service, "refreshTokenTtlDays", 7L);

        String rawToken = service.create(user());

        assertThat(rawToken).isNotBlank();
        assertThat(repository.lastSaved.getTokenHash()).isNotBlank();
        assertThat(repository.lastSaved.getTokenHash()).isNotEqualTo(rawToken);
        assertThat(repository.lastSaved.isActive()).isTrue();
    }

    @Test
    void rotateRevokesCurrentTokenAndReturnsUser() {
        InMemoryRefreshTokenRepository repository = new InMemoryRefreshTokenRepository();
        RefreshTokenService service = newService(repository);
        ReflectionTestUtils.setField(service, "refreshTokenTtlDays", 7L);

        User user = user();
        String rawToken = service.create(user);

        User rotatedUser = service.rotate(rawToken);

        assertThat(rotatedUser).isEqualTo(user);
        assertThat(repository.lastSaved.isRevoked()).isTrue();
    }

    @Test
    void rotateRejectsExpiredToken() {
        InMemoryRefreshTokenRepository repository = new InMemoryRefreshTokenRepository();
        RefreshTokenService service = newService(repository);
        ReflectionTestUtils.setField(service, "refreshTokenTtlDays", 7L);
        String rawToken = service.create(user());
        repository.lastSaved.setExpiresAt(LocalDateTime.now().minusMinutes(1));

        assertThatThrownBy(() -> service.rotate(rawToken))
                .isInstanceOf(InvalidTokenException.class)
                .hasMessage("Invalid refresh token");
    }

    @Test
    void revokeAllDeletesUserTokens() {
        InMemoryRefreshTokenRepository repository = new InMemoryRefreshTokenRepository();
        RefreshTokenService service = newService(repository);
        User user = user();

        service.revokeAll(user);

        assertThat(repository.deletedUser).isEqualTo(user);
    }

    private User user() {
        return User.builder()
                .id(1L)
                .email("user@example.com")
                .username("user")
                .role(Role.USER)
                .build();
    }

    private static class InMemoryRefreshTokenRepository {
        private final Map<String, RefreshToken> tokensByHash = new HashMap<>();
        private RefreshToken lastSaved;
        private User deletedUser;

        private RefreshTokenRepository proxy() {
            return (RefreshTokenRepository) Proxy.newProxyInstance(
                    RefreshTokenRepository.class.getClassLoader(),
                    new Class[]{RefreshTokenRepository.class},
                    (proxy, method, args) -> switch (method.getName()) {
                        case "save" -> save((RefreshToken) args[0]);
                        case "findByTokenHash" -> Optional.ofNullable(tokensByHash.get((String) args[0]));
                        case "deleteByUser" -> {
                            deletedUser = (User) args[0];
                            yield null;
                        }
                        default -> throw new UnsupportedOperationException(method.getName());
                    }
            );
        }

        private RefreshToken save(RefreshToken refreshToken) {
            lastSaved = refreshToken;
            tokensByHash.put(refreshToken.getTokenHash(), refreshToken);
            return refreshToken;
        }
    }

    private RefreshTokenService newService(InMemoryRefreshTokenRepository repository) {
        return new RefreshTokenService(repository.proxy());
    }
}
