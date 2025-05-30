package com.rentreturn.backend.controller;

import com.rentreturn.backend.dto.*;
import com.rentreturn.backend.model.User;
import com.rentreturn.backend.service.JwtTokenService;
import com.rentreturn.backend.service.UserService;
import io.jsonwebtoken.Claims;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtTokenService jwtTokenService;

    @PostMapping
    public UserDTO createUser(@RequestBody UserCreateRequest userRequest) {
        return userService.createUser(userRequest);
    }

    @GetMapping("/{id}")
    public UserDTO getUserById(@PathVariable int id) {
        return userService.getUserById(id);
    }

    @GetMapping
    public List<UserDTO> getAllUsers() {
        return userService.getAllUsers();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable int id) {
        userService.deleteUser(id);
        return ResponseEntity.ok("User deleted successfully");
    }

    @GetMapping("/me")
    public ResponseEntity<UserDTO> getCurrentUser(Authentication authentication) {
        String email = authentication.getName(); // gets the logged-in user's email
        User user = userService.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        return ResponseEntity.ok(new UserDTO(user));
    }

    @GetMapping("/token/validate")
    public ResponseEntity<?> validateToken(@RequestParam String token) {
        try {
            String username = jwtTokenService.extractUsername(token);
            boolean expired = jwtTokenService.extractClaim(token, Claims::getExpiration).before(new Date());
            Map<String, Object> result = new HashMap<>();
            result.put("username", username);
            result.put("expired", expired);
            result.put("expiration", jwtTokenService.extractClaim(token, Claims::getExpiration));
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Invalid token: " + e.getMessage());
        }
    }

    @PutMapping("/me")
    public ResponseEntity<UserDTO> updateCurrentUser(@RequestBody UserUpdateRequest updateRequest, Authentication authentication) {
        String email = authentication.getName();
        UserDTO updatedUser = userService.updateUser(email, updateRequest);
        return ResponseEntity.ok(updatedUser);
    }

    @PutMapping("/me/password")
    public ResponseEntity<?> changePassword(@RequestBody PasswordChangeRequest passwordChangeRequest, Authentication authentication) {
        String email = authentication.getName();
        userService.changePassword(email, passwordChangeRequest);
        return ResponseEntity.ok("Password changed successfully");
    }

    @PostMapping("/token/refresh")
    public ResponseEntity<?> refreshToken(@RequestBody TokenRefreshRequest request) {
        String refreshToken = request.getRefreshToken();
        String refreshedToken = jwtTokenService.refreshToken(refreshToken);
        return ResponseEntity.ok(new TokenRefreshResponse(refreshedToken, refreshToken));
    }
}
