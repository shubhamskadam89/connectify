package com.connectify.backend.follow.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class FollowRequest {
    @NotNull
    @Positive
    private Long followerId;

    @NotNull
    @Positive
    private Long followingId;
}
