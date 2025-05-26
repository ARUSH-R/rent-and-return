package com.rentreturn.backend.controller;

import com.rentreturn.backend.dto.UserCreateRequest;
import com.rentreturn.backend.dto.UserDTO;
import com.rentreturn.backend.service.JwtTokenService;
import com.rentreturn.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import io.jsonwebtoken.Claims;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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

    @DeleteMapping("/{id}")
    public String deleteUser(@PathVariable int id) {
        userService.deleteUser(id);
        return "User deleted successfully!";
    }

    // Endpoint to check if a JWT token is valid/expired
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

}
