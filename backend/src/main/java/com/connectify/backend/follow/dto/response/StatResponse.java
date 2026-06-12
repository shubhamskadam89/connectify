package com.connectify.backend.follow.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class StatResponse {
    private Long userId;
    private long followersCount;
    private long followingCount;
}
