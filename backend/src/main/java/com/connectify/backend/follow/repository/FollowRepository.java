package com.connectify.backend.follow.repository;


import com.connectify.backend.follow.entity.Follow;
import com.connectify.backend.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FollowRepository extends JpaRepository<Follow,Long> {
    List<Follow> findByFollower(User follower);

    List<Follow> findByFollowing(User following);

    boolean existsByFollowerAndFollowing(User follower, User following);

    Optional<Follow> findByFollowerAndFollowing(User follower, User following);

    long countByFollower(User follower);

    long countByFollowing(User following);

    void deleteByFollowerAndFollowing(User follower, User following);
}
