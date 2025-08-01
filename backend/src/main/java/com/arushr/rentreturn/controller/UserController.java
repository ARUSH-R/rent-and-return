package com.arushr.rentreturn.controller;

import com.arushr.rentreturn.model.User;
import com.arushr.rentreturn.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<User> registerUser(@Valid @RequestBody User user) {
        return ResponseEntity.ok(userService.register(user));
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return userService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.findAll());
    }

    @GetMapping("/active")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<User>> getActiveUsers() {
        return ResponseEntity.ok(userService.findAllActiveUsers());
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @Valid @RequestBody User updatedUser) {
        return ResponseEntity.ok(userService.updateUser(id, updatedUser));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> softDeleteUser(@PathVariable Long id) {
        userService.softDeleteUser(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/block")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> blockUser(@PathVariable Long id) {
        userService.blockUser(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/unblock")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> unblockUser(@PathVariable Long id) {
        userService.unblockUser(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/email")
    public ResponseEntity<User> findByEmail(@RequestParam String email) {
        return userService.findByEmail(email)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/username")
    public ResponseEntity<User> findByUsername(@RequestParam String username) {
        return userService.findByUsername(username)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/phone")
    public ResponseEntity<User> findByPhone(@RequestParam String phone) {
        return userService.findByPhone(phone)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/role")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<User>> findByRole(@RequestParam String role) {
        return ResponseEntity.ok(userService.findAllByRole(role));
    }

    @GetMapping("/verified")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<User>> findByEmailVerified(@RequestParam boolean verified) {
        return ResponseEntity.ok(userService.findAllByEmailVerified(verified));
    }

    @GetMapping("/enabled")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<User>> findByEnabled(@RequestParam boolean enabled) {
        return ResponseEntity.ok(userService.findAllByEnabled(enabled));
    }

    @GetMapping("/deleted")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<User>> findByDeleted(@RequestParam boolean deleted) {
        return ResponseEntity.ok(userService.findAllByDeleted(deleted));
    }

    @GetMapping("/search")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<User>> searchByNameOrEmail(@RequestParam String query) {
        return ResponseEntity.ok(userService.searchByNameOrEmail(query));
    }

    @GetMapping("/created-after")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<User>> findCreatedAfter(@RequestParam String dateTime) {
        return ResponseEntity.ok(userService.findAllCreatedAfter(java.time.LocalDateTime.parse(dateTime)));
    }

    @GetMapping("/count/role")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Long> countByRole(@RequestParam String role) {
        return ResponseEntity.ok(userService.countByRole(role));
    }

    @GetMapping("/role-in")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<User>> findByRoles(@RequestParam List<String> roles) {
        return ResponseEntity.ok(userService.findAllByRoleIn(roles));
    }

    @GetMapping("/count/enabled")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Long> countByEnabled(@RequestParam boolean enabled) {
        return ResponseEntity.ok(userService.countByEnabled(enabled));
    }

    @PostMapping("/admin/enable-all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> enableAllUsers() {
        userService.findAll().forEach(user -> {
            user.setEnabled(true);
            user.setDeleted(false);
            userService.register(user); // save updated user
        });
        return ResponseEntity.ok("All users enabled and undeleted.");
    }
}
