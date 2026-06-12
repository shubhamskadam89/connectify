package com.connectify.backend.follow.service;

import com.connectify.backend.common.exception.AlreadyExistsException;
import com.connectify.backend.common.exception.BadRequestException;
import com.connectify.backend.common.exception.ResourceNotFoundException;
import com.connectify.backend.follow.dto.request.FollowRequest;
import com.connectify.backend.follow.dto.request.UnFollowRequest;
import com.connectify.backend.follow.dto.response.FollowResponse;
import com.connectify.backend.follow.dto.response.FollowStatusResponse;
import com.connectify.backend.follow.dto.response.FollowerResponse;
import com.connectify.backend.follow.dto.response.StatResponse;
import com.connectify.backend.follow.dto.response.UnFollowResponse;
import com.connectify.backend.follow.entity.Follow;
import com.connectify.backend.follow.repository.FollowRepository;
import com.connectify.backend.user.entity.User;
import com.connectify.backend.user.repository.UserRepository;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.annotation.Validated;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
@Validated
public class FollowService {

    private final FollowRepository followRepository;
    private final UserRepository userRepository;


    public FollowResponse follow(@Valid FollowRequest followRequest) {
        log.info(
                "Follow request initiated. followerId={}, followingId={}",
                followRequest.getFollowerId(),
                followRequest.getFollowingId()
        );

        validateNotSelfFollow(followRequest.getFollowerId(), followRequest.getFollowingId());

        User follower = getUserById(followRequest.getFollowerId());
        User following = getUserById(followRequest.getFollowingId());

        if (followRepository.existsByFollowerAndFollowing(follower, following)) {
            throw new AlreadyExistsException("Already following");
        }

        Follow follow = Follow.builder()
                .follower(follower)
                .following(following)
                .build();

        Follow savedFollow = followRepository.save(follow);

        log.debug("Follow relation created. followId={}", savedFollow.getId());

        return FollowResponse.builder()
                .followerId(savedFollow.getFollower().getId())
                .followingId(savedFollow.getFollowing().getId())
                .msg(savedFollow.getFollower().getId() + " follows " + savedFollow.getFollowing().getId())
                .build();

    }


    public UnFollowResponse unfollow(@Valid UnFollowRequest unfollowRequest) {
        log.info(
                "Unfollow request initiated. followerId={}, followingId={}",
                unfollowRequest.getFollowerId(),
                unfollowRequest.getFollowingId()
        );

        validateNotSelfFollow(unfollowRequest.getFollowerId(), unfollowRequest.getFollowingId());

        User follower = getUserById(unfollowRequest.getFollowerId());
        User following = getUserById(unfollowRequest.getFollowingId());

        Follow follow = followRepository.findByFollowerAndFollowing(follower, following)
                .orElseThrow(() -> new ResourceNotFoundException("Follow relationship not found"));

        followRepository.delete(follow);

        log.debug("Follow relation deleted. followId={}", follow.getId());

        return UnFollowResponse.builder()
                .followerId(follow.getFollower().getId())
                .followingId(follow.getFollowing().getId())
                .msg(follow.getFollower().getId() + " unfollows " + follow.getFollowing().getId())
                .build();

    }


    @Transactional(readOnly = true)
    public List<FollowerResponse> getFollowers(@Positive Long userId) {
        log.info("Get followers request initiated for userId={}", userId);

        User following = getUserById(userId);

        List<Follow> follows = followRepository.findByFollowing(following);

        return follows.stream()
                .map(follow -> toFollowerResponse(follow.getFollower()))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<FollowerResponse> getFollowing(@Positive Long userId) {
        log.info("Get following request initiated for userId={}", userId);

        User follower = getUserById(userId);

        return followRepository.findByFollower(follower)
                .stream()
                .map(follow -> toFollowerResponse(follow.getFollowing()))
                .toList();
    }

    @Transactional(readOnly = true)
    public StatResponse getFollowStats(@Positive Long userId) {
        log.info("Get follow stats request initiated for userId={}", userId);

        User user = getUserById(userId);

        return StatResponse.builder()
                .userId(user.getId())
                .followersCount(followRepository.countByFollowing(user))
                .followingCount(followRepository.countByFollower(user))
                .build();
    }

    @Transactional(readOnly = true)
    public FollowStatusResponse getFollowStatus(@Positive Long followerId, @Positive Long followingId) {
        log.info(
                "Get follow status request initiated. followerId={}, followingId={}",
                followerId,
                followingId
        );

        validateNotSelfFollow(followerId, followingId);

        User follower = getUserById(followerId);
        User following = getUserById(followingId);

        return FollowStatusResponse.builder()
                .followerId(follower.getId())
                .followingId(following.getId())
                .following(followRepository.existsByFollowerAndFollowing(follower, following))
                .build();
    }

    @Transactional(readOnly = true)
    public List<FollowerResponse> getMutualFollowers(@Positive Long userId, @Positive Long otherUserId) {
        log.info(
                "Get mutual followers request initiated. userId={}, otherUserId={}",
                userId,
                otherUserId
        );

        if (userId.equals(otherUserId)) {
            throw new BadRequestException("Users must be different");
        }

        User user = getUserById(userId);
        User otherUser = getUserById(otherUserId);

        Set<Long> userFollowerIds = new HashSet<>(
                followRepository.findByFollowing(user)
                        .stream()
                        .map(follow -> follow.getFollower().getId())
                        .toList()
        );

        return followRepository.findByFollowing(otherUser)
                .stream()
                .map(Follow::getFollower)
                .filter(follower -> userFollowerIds.contains(follower.getId()))
                .map(this::toFollowerResponse)
                .toList();
    }

    private User getUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("No such user"));
    }

    private void validateNotSelfFollow(Long followerId, Long followingId) {
        if (followerId != null && followerId.equals(followingId)) {
            throw new BadRequestException("User cannot follow themselves");
        }
    }

    private FollowerResponse toFollowerResponse(User follower) {
        FollowerResponse response = new FollowerResponse();
        response.setId(follower.getId());
        response.setUserName(follower.getUsername());
        response.setFirstName(follower.getFirstName());
        response.setLastName(follower.getLastName());
        return response;
    }
}
