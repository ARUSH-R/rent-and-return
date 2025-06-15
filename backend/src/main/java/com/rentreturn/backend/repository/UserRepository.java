package com.rentreturn.backend.repository;

import com.rentreturn.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    boolean existsByUsername(String username);

    Optional<User> findByPhone(String phone);

    boolean existsByPhone(String phone);

    Optional<User> findByResetPasswordToken(String resetPasswordToken);

    List<User> findAllByDeletedFalse();

    List<User> findAllByRole(String role);

    List<User> findAllByEmailVerified(boolean emailVerified);

    List<User> findAllByEnabled(boolean enabled);

    List<User> findAllByDeleted(boolean deleted);

    // Search users by partial name or email (case-insensitive)
    List<User> findByNameContainingIgnoreCaseOrEmailContainingIgnoreCase(String name, String email);

    // Find all users created after a certain date
    List<User> findAllByCreatedAtAfter(java.time.LocalDateTime date);

    // Count users by role
    long countByRole(String role);
}
