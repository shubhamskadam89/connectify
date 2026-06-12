package com.connectify.backend.follow.dto.response;

import lombok.Data;

@Data
public class FollowerResponse {
    private Long id;
    private String userName;
    private String firstName;
    private String lastName;
}
