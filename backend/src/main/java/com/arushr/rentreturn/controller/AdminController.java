package com.arushr.rentreturn.controller;

import com.arushr.rentreturn.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final UserService userService;

    @GetMapping("/user-count")
    public ResponseEntity<Long> getUserCount() {
        return ResponseEntity.ok((long) userService.findAll().size());
    }

    @GetMapping("/active-users")
    public ResponseEntity<Long> getActiveUserCount() {
        return ResponseEntity.ok((long) userService.findAllActiveUsers().size());
    }

    // Add more admin analytics/management endpoints as needed
}
