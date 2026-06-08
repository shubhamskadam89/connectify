package com.connectify.backend.user.controller;

import com.connectify.backend.user.dto.request.UpdateUserProfileRequest;
import com.connectify.backend.user.dto.response.CurrentUserProfileResponse;
import com.connectify.backend.user.dto.response.PublicUserProfileResponse;
import com.connectify.backend.user.service.UserProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;

@RestController
@RequestMapping("/api/users/v1")
@RequiredArgsConstructor
public class UserController {

    private final UserProfileService userProfileService;

    @GetMapping("/me")
    public ResponseEntity<CurrentUserProfileResponse> getCurrentUser(Principal principal) {
        return ResponseEntity.ok(userProfileService.getCurrentUser(principal));
    }

    @PatchMapping("/me")
    public ResponseEntity<CurrentUserProfileResponse> updateCurrentUser(
            Principal principal,
            @Valid @RequestBody UpdateUserProfileRequest request
    ) {
        return ResponseEntity.ok(userProfileService.updateCurrentUser(principal, request));
    }

    @GetMapping("/profiles/{username}")
    public ResponseEntity<PublicUserProfileResponse> getPublicProfile(@PathVariable String username) {
        return ResponseEntity.ok(userProfileService.getPublicProfile(username));
    }
}
