package com.connectify.backend.auth.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginResponse {

    private String message;
    private boolean otpRequired;
    private String accessToken;
    private String refreshToken;

    @Builder.Default
    private String tokenType = "Bearer";
    private UserResponse user;
}
