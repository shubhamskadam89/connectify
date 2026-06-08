package com.connectify.backend.user.service;

import com.connectify.backend.common.exception.ResourceNotFoundException;
import com.connectify.backend.common.exception.UnauthorizedException;
import com.connectify.backend.user.dto.request.UpdateUserProfileRequest;
import com.connectify.backend.user.dto.response.CurrentUserProfileResponse;
import com.connectify.backend.user.dto.response.PublicUserProfileResponse;
import com.connectify.backend.user.entity.User;
import com.connectify.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.Principal;

@Service
@Slf4j
@RequiredArgsConstructor
public class UserProfileService {

    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public CurrentUserProfileResponse getCurrentUser(Principal principal) {
        User user = resolveAuthenticatedUser(principal);
        log.info("Current profile read for userId={}, email={}", user.getId(), user.getEmail());
        return toCurrentUserProfileResponse(user);
    }

    @Transactional(readOnly = true)
    public PublicUserProfileResponse getPublicProfile(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User profile not found"));

        log.info("Public profile read for userId={}, username={}", user.getId(), user.getUsername());
        return toPublicUserProfileResponse(user);
    }

    @Transactional
    public CurrentUserProfileResponse updateCurrentUser(
            Principal principal,
            UpdateUserProfileRequest request
    ) {
        User user = resolveAuthenticatedUser(principal);

        user.setFirstName(normalize(request.getFirstName()));
        user.setLastName(normalize(request.getLastName()));
        user.setBio(normalize(request.getBio()));
        user.setProfileImageUrl(normalize(request.getProfileImageUrl()));
        user.setLocation(normalize(request.getLocation()));
        user.setWebsite(normalize(request.getWebsite()));

        User savedUser = userRepository.save(user);
        log.info("Current profile updated for userId={}, email={}", savedUser.getId(), savedUser.getEmail());

        return toCurrentUserProfileResponse(savedUser);
    }

    private User resolveAuthenticatedUser(Principal principal) {
        if (principal == null || principal.getName() == null || principal.getName().isBlank()) {
            throw new UnauthorizedException("You must be authenticated to access this profile");
        }

        return userRepository.findByEmail(principal.getName())
                .or(() -> userRepository.findByUsername(principal.getName()))
                .orElseThrow(() -> new UnauthorizedException("Authenticated user was not found"));
    }

    private CurrentUserProfileResponse toCurrentUserProfileResponse(User user) {
        return CurrentUserProfileResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .username(user.getUsername())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .bio(user.getBio())
                .profileImageUrl(user.getProfileImageUrl())
                .location(user.getLocation())
                .website(user.getWebsite())
                .role(user.getRole())
                .emailVerified(user.isEmailVerified())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }

    private PublicUserProfileResponse toPublicUserProfileResponse(User user) {
        return PublicUserProfileResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .bio(user.getBio())
                .profileImageUrl(user.getProfileImageUrl())
                .location(user.getLocation())
                .website(user.getWebsite())
                .createdAt(user.getCreatedAt())
                .build();
    }

    private String normalize(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }

        return value.trim();
    }
}
