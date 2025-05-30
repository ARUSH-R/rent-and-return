package com.rentreturn.backend.controller.auth;

import com.rentreturn.backend.dto.TokenRefreshRequest;
import com.rentreturn.backend.dto.TokenRefreshResponse;
import com.rentreturn.backend.dto.auth.AuthRequest;
import com.rentreturn.backend.dto.auth.AuthResponse;
import com.rentreturn.backend.service.JwtTokenService;
import com.rentreturn.backend.service.UserDetailsServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenService jwtService;
    private final UserDetailsServiceImpl userDetailsService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );

            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String accessToken = jwtService.generateToken(userDetails);

            return ResponseEntity.ok(new AuthResponse(accessToken));
        } catch (org.springframework.security.core.AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new AuthResponse("Authentication failed: " + e.getMessage()));
        }
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(@RequestBody TokenRefreshRequest request) {
        try {
            String refreshToken = request.getRefreshToken();

            if (!jwtService.isTokenValid(refreshToken)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired refresh token");
            }

            String email = jwtService.extractUsername(refreshToken);
            UserDetails userDetails = userDetailsService.loadUserByUsername(email);
            String newAccessToken = jwtService.generateToken(userDetails);

            return ResponseEntity.ok(new TokenRefreshResponse(newAccessToken, refreshToken));

        } catch (Throwable e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Token refresh failed: " + e.getMessage());
        }
    }
}