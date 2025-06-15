package com.rentreturn.backend.controller;

import com.rentreturn.backend.model.User;
import com.rentreturn.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<User> registerUser(@RequestBody User user) {
        return ResponseEntity.ok(userService.register(user));
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return userService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.findAll());
    }

    @GetMapping("/active")
    public ResponseEntity<List<User>> getActiveUsers() {
        return ResponseEntity.ok(userService.findAllActiveUsers());
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User updatedUser) {
        return ResponseEntity.ok(userService.updateUser(id, updatedUser));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> softDeleteUser(@PathVariable Long id) {
        userService.softDeleteUser(id);
        return ResponseEntity.noContent().build();
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
    public ResponseEntity<List<User>> findByRole(@RequestParam String role) {
        return ResponseEntity.ok(userService.findAllByRole(role));
    }

    @GetMapping("/verified")
    public ResponseEntity<List<User>> findByEmailVerified(@RequestParam boolean verified) {
        return ResponseEntity.ok(userService.findAllByEmailVerified(verified));
    }

    @GetMapping("/enabled")
    public ResponseEntity<List<User>> findByEnabled(@RequestParam boolean enabled) {
        return ResponseEntity.ok(userService.findAllByEnabled(enabled));
    }

    @GetMapping("/deleted")
    public ResponseEntity<List<User>> findByDeleted(@RequestParam boolean deleted) {
        return ResponseEntity.ok(userService.findAllByDeleted(deleted));
    }

    @GetMapping("/search")
    public ResponseEntity<List<User>> searchByNameOrEmail(@RequestParam String query) {
        return ResponseEntity.ok(userService.searchByNameOrEmail(query));
    }

    @GetMapping("/created-after")
    public ResponseEntity<List<User>> findCreatedAfter(@RequestParam String dateTime) {
        return ResponseEntity.ok(userService.findAllCreatedAfter(java.time.LocalDateTime.parse(dateTime)));
    }

    @GetMapping("/count/role")
    public ResponseEntity<Long> countByRole(@RequestParam String role) {
        return ResponseEntity.ok(userService.countByRole(role));
    }

    @GetMapping("/role-in")
    public ResponseEntity<List<User>> findByRoles(@RequestParam List<String> roles) {
        return ResponseEntity.ok(userService.findAllByRoleIn(roles));
    }

    @GetMapping("/count/enabled")
    public ResponseEntity<Long> countByEnabled(@RequestParam boolean enabled) {
        return ResponseEntity.ok(userService.countByEnabled(enabled));
    }
}
