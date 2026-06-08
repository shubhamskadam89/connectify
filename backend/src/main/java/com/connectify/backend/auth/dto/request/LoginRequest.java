package com.connectify.backend.auth.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class LoginRequest {

    @NotBlank
    @Size(max = 100)
    private String identifier;

    @Size(min = 6, max = 100)
    private String password;
}
