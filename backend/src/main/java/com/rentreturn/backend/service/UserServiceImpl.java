package com.rentreturn.backend.service;

import com.rentreturn.backend.model.User;
import com.rentreturn.backend.repository.UserRepository;
import com.rentreturn.backend.service.UserService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Override
    public User register(User user) {
        return userRepository.save(user);
    }

    @Override
    public Optional<User> findById(Long id) {
        return userRepository.findById(id).filter(user -> !user.isDeleted());
    }

    @Override
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email).filter(user -> !user.isDeleted());
    }

    @Override
    public List<User> findAll() {
        return userRepository.findAll();
    }

    @Override
    public List<User> findAllActiveUsers() {
        return userRepository.findAllByDeletedFalse();
    }

    @Override
    public User updateUser(Long id, User updatedUser) {
        return userRepository.findById(id)
                .map(user -> {
                    user.setName(updatedUser.getName());
                    user.setPhone(updatedUser.getPhone());
                    return userRepository.save(user);
                })
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @Override
    public void softDeleteUser(Long id) {
        userRepository.findById(id).ifPresent(user -> {
            user.setDeleted(true);
            userRepository.save(user);
        });
    }

    @Override
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    @Override
    public boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }

    @Override
    public Optional<User> findByPhone(String phone) {
        return userRepository.findByPhone(phone).filter(user -> !user.isDeleted());
    }

    @Override
    public Optional<User> findByUsername(String username) {
        return userRepository.findAll().stream()
                .filter(u -> username.equals(u.getUsername()) && !u.isDeleted())
                .findFirst();
    }

    @Override
    public List<User> findAllByRole(String role) {
        return userRepository.findAllByRole(role);
    }

    @Override
    public List<User> findAllByEmailVerified(boolean emailVerified) {
        return userRepository.findAllByEmailVerified(emailVerified);
    }

    @Override
    public List<User> findAllByEnabled(boolean enabled) {
        return userRepository.findAllByEnabled(enabled);
    }

    @Override
    public List<User> findAllByDeleted(boolean deleted) {
        return userRepository.findAllByDeleted(deleted);
    }

    @Override
    public List<User> searchByNameOrEmail(String query) {
        return userRepository.findByNameContainingIgnoreCaseOrEmailContainingIgnoreCase(query, query);
    }

    @Override
    public List<User> findAllCreatedAfter(LocalDateTime date) {
        return userRepository.findAllByCreatedAtAfter(date);
    }

    @Override
    public long countByRole(String role) {
        return userRepository.countByRole(role);
    }

    @Override
    public List<User> findAllByRoleIn(List<String> roles) {
        return userRepository.findAll().stream()
                .filter(user -> roles.contains(user.getRole()) && !user.isDeleted())
                .toList();
    }

    @Override
    public long countByEnabled(boolean enabled) {
        return userRepository.findAllByEnabled(enabled).stream().count();
    }
}
