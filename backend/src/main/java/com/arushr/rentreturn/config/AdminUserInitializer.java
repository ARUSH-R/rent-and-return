package com.arushr.rentreturn.config;

import com.arushr.rentreturn.enums.Role;
import com.arushr.rentreturn.model.User;
import com.arushr.rentreturn.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@RequiredArgsConstructor
public class AdminUserInitializer {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Bean
    public CommandLineRunner ensureAdminUser() {
        return args -> {
            String adminEmail = "admin@rentreturn.com";
            if (userRepository.findByEmail(adminEmail).isEmpty()) {
                User admin = User.builder()
                        .username("admin")
                        .email(adminEmail)
                        .password(passwordEncoder.encode("admin3690"))
                        .role(Role.ADMIN)
                        .enabled(true)
                        .deleted(false)
                        .emailVerified(true)
                        .accountNonLocked(true)
                        .build();
                userRepository.save(admin);
                System.out.println("Default admin user created: " + adminEmail + " / admin3690");
            } else {
                System.out.println("Admin user already exists: " + adminEmail);
            }
        };
    }
} 