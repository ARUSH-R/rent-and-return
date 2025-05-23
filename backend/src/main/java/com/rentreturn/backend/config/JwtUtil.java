package com.rentreturn.backend.config;


import java.util.Date;

public class JwtUtil {

    public String generateToken(org.springframework.security.core.Authentication authentication) {
        String username = authentication.getName();
        long expiration = 3600000; // 1 hour in ms, or fetch from properties
        String secret = System.getenv("JWT_SECRET"); // or use @Value to inject

        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expiration);

        return io.jsonwebtoken.Jwts.builder()
                .setSubject(username)
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(io.jsonwebtoken.SignatureAlgorithm.HS256, secret)
                .compact();
    }
}
