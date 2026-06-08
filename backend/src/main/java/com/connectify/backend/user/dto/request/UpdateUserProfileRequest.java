package com.connectify.backend.user.dto.request;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateUserProfileRequest {

    @Size(max = 255)
    private String firstName;

    @Size(max = 255)
    private String lastName;

    @Size(max = 500)
    private String bio;

    @Size(max = 255)
    private String profileImageUrl;

    @Size(max = 255)
    private String location;

    @Size(max = 255)
    private String website;
}
