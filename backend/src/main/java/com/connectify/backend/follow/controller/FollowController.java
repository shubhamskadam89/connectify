package com.connectify.backend.follow.controller;

import com.connectify.backend.follow.dto.request.FollowRequest;
import com.connectify.backend.follow.dto.request.UnFollowRequest;
import com.connectify.backend.follow.dto.response.FollowResponse;
import com.connectify.backend.follow.dto.response.FollowStatusResponse;
import com.connectify.backend.follow.dto.response.FollowerResponse;
import com.connectify.backend.follow.dto.response.StatResponse;
import com.connectify.backend.follow.dto.response.UnFollowResponse;
import com.connectify.backend.follow.service.FollowService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users/v1")
@RequiredArgsConstructor
@Validated
public class FollowController {

    private final FollowService followService;


    @PostMapping("/follow")
    public ResponseEntity<FollowResponse> follow(@Valid @RequestBody FollowRequest followRequest) {
        return ResponseEntity.status(HttpStatus.CREATED).body(followService.follow(followRequest));

    }

    @DeleteMapping("/follow")
    public ResponseEntity<UnFollowResponse> unfollow(@Valid @RequestBody UnFollowRequest unFollowRequest) {
        return ResponseEntity.ok(followService.unfollow(unFollowRequest));
    }

    @GetMapping("/{userId}/followers")
    public ResponseEntity<List<FollowerResponse>> getFollowers(@Positive @PathVariable Long userId) {
        return ResponseEntity.ok(followService.getFollowers(userId));
    }

    @GetMapping("/{userId}/following")
    public ResponseEntity<List<FollowerResponse>> getFollowing(@Positive @PathVariable Long userId) {
        return ResponseEntity.ok(followService.getFollowing(userId));
    }

    @GetMapping("/{userId}/followers/count")
    public ResponseEntity<StatResponse> getFollowersCount(@Positive @PathVariable Long userId) {
        return ResponseEntity.ok(followService.getFollowStats(userId));
    }

    @GetMapping("/{userId}/following/count")
    public ResponseEntity<StatResponse> getFollowingCount(@Positive @PathVariable Long userId) {
        return ResponseEntity.ok(followService.getFollowStats(userId));
    }

    @GetMapping("/{userId}/follow-status")
    public ResponseEntity<FollowStatusResponse> getFollowStatus(
            @Positive @PathVariable Long userId,
            @Positive @RequestParam Long followerId
    ) {
        return ResponseEntity.ok(followService.getFollowStatus(followerId, userId));
    }

    @GetMapping("/{userId}/mutual-followers/{otherUserId}")
    public ResponseEntity<List<FollowerResponse>> getMutualFollowers(
            @Positive @PathVariable Long userId,
            @Positive @PathVariable Long otherUserId
    ) {
        return ResponseEntity.ok(followService.getMutualFollowers(userId, otherUserId));
    }

}
