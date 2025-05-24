package com.rentreturn.backend.service.auth;

import com.rentreturn.backend.dto.auth.AuthRequest;
import com.rentreturn.backend.dto.auth.AuthResponse;
import com.rentreturn.backend.dto.auth.RegisterRequest;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse authenticate(AuthRequest request);
}
