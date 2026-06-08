package com.connectify.backend.auth.dto.response;

import com.connectify.backend.user.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponse {

    private Long id;
    private String email;
    private String username;
    private String firstName;
    private String lastName;
    private Role role;
}
