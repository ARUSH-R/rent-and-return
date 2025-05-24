package com.rentreturn.backend.service.auth;

import com.rentreturn.backend.dto.auth.AuthRequest;
import com.rentreturn.backend.dto.auth.AuthResponse;
import com.rentreturn.backend.dto.auth.RegisterRequest;
import com.rentreturn.backend.model.User;
import com.rentreturn.backend.repository.UserRepository;
import com.rentreturn.backend.security.JwtService;
import org.springframework.beans.factory.annotation.Qualifier;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final @Qualifier("jwtService") JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @Override
    public AuthResponse register(RegisterRequest request) {
        var user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role("USER")
                .build();

        userRepository.save(user);
        String jwt = jwtService.generateToken(user);

        return AuthResponse.builder()
                .token(jwt)
                .build();
    }

    @Override
    public AuthResponse authenticate(AuthRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        var user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));
        String jwt = jwtService.generateToken(user);

        return AuthResponse.builder()
                .token(jwt)
                .build();
    }
}
