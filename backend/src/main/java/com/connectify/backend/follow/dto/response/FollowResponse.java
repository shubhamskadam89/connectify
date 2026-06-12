package com.connectify.backend.follow.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class FollowResponse {
    private Long followerId;
    private Long followingId;
    private String msg;
}
