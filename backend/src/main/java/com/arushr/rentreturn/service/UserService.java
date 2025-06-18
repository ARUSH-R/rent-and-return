package com.arushr.rentreturn.service;

import com.arushr.rentreturn.model.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;

import java.util.List;
import java.util.Optional;

public interface UserService extends UserDetailsService {

    User register(User user);

    Optional<User> findById(Long id);

    Optional<User> findByEmail(String email);

    List<User> findAll();

    List<User> findAllActiveUsers();

    User updateUser(Long id, User updatedUser);

    void softDeleteUser(Long id);

    boolean existsByEmail(String email);

    boolean existsByUsername(String username);

    Optional<User> findByPhone(String phone);

    Optional<User> findByUsername(String username);

    List<User> findAllByRole(String role);

    List<User> findAllByEmailVerified(boolean emailVerified);

    List<User> findAllByEnabled(boolean enabled);

    List<User> findAllByDeleted(boolean deleted);

    List<User> searchByNameOrEmail(String query);

    List<User> findAllCreatedAfter(java.time.LocalDateTime date);

    long countByRole(String role);

    List<User> findAllByRoleIn(List<String> roles);

    long countByEnabled(boolean enabled);


    UserDetails loadUserByUsername(String username);


}
