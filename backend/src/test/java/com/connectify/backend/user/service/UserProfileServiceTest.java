package com.connectify.backend.user.service;

import com.connectify.backend.common.exception.UnauthorizedException;
import com.connectify.backend.user.dto.request.UpdateUserProfileRequest;
import com.connectify.backend.user.dto.response.CurrentUserProfileResponse;
import com.connectify.backend.user.dto.response.PublicUserProfileResponse;
import com.connectify.backend.user.entity.Role;
import com.connectify.backend.user.entity.User;
import com.connectify.backend.user.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class UserProfileServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserProfileService userProfileService;

    @Test
    void getCurrentUserReturnsPrivateProfileWithoutPassword() {
        User user = buildUser();
        when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.of(user));

        CurrentUserProfileResponse response = userProfileService.getCurrentUser(principal("user@example.com"));

        assertThat(response.getEmail()).isEqualTo("user@example.com");
        assertThat(response.getUsername()).isEqualTo("testuser");
        assertThat(response.getRole()).isEqualTo(Role.USER);
        assertThat(response.getBio()).isEqualTo("Backend learner");
    }

    @Test
    void getPublicProfileExcludesSensitiveAccountFields() {
        User user = buildUser();
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(user));

        PublicUserProfileResponse response = userProfileService.getPublicProfile("testuser");

        assertThat(response.getUsername()).isEqualTo("testuser");
        assertThat(response.getBio()).isEqualTo("Backend learner");
        assertThat(response).hasNoNullFieldsOrPropertiesExcept("profileImageUrl", "website");
    }

    @Test
    void updateCurrentUserOnlyChangesEditableProfileFields() {
        User user = buildUser();
        when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        UpdateUserProfileRequest request = UpdateUserProfileRequest.builder()
                .firstName("  Ada  ")
                .lastName("  Lovelace  ")
                .bio("  Builds reliable APIs  ")
                .location(" London ")
                .website(" https://example.com ")
                .build();

        CurrentUserProfileResponse response = userProfileService.updateCurrentUser(
                principal("user@example.com"),
                request
        );

        assertThat(response.getFirstName()).isEqualTo("Ada");
        assertThat(response.getLastName()).isEqualTo("Lovelace");
        assertThat(response.getBio()).isEqualTo("Builds reliable APIs");
        assertThat(response.getLocation()).isEqualTo("London");
        assertThat(response.getWebsite()).isEqualTo("https://example.com");
        assertThat(response.getEmail()).isEqualTo("user@example.com");
        assertThat(response.getRole()).isEqualTo(Role.USER);

        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(userCaptor.capture());
        assertThat(userCaptor.getValue().getPassword()).isEqualTo("encoded-password");
    }

    @Test
    void updateCurrentUserRequiresAuthenticatedPrincipal() {
        assertThatThrownBy(() -> userProfileService.updateCurrentUser(null, UpdateUserProfileRequest.builder().build()))
                .isInstanceOf(UnauthorizedException.class);

        verify(userRepository, never()).save(any());
    }

    private Principal principal(String name) {
        return () -> name;
    }

    private User buildUser() {
        return User.builder()
                .id(1L)
                .email("user@example.com")
                .username("testuser")
                .password("encoded-password")
                .firstName("Test")
                .lastName("User")
                .bio("Backend learner")
                .location("Pune")
                .role(Role.USER)
                .emailVerified(true)
                .createdAt(LocalDateTime.parse("2026-06-08T09:00:00"))
                .updatedAt(LocalDateTime.parse("2026-06-08T09:30:00"))
                .build();
    }
}
