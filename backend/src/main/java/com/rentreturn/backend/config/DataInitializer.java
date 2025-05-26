package com.rentreturn.backend.config;

import com.rentreturn.backend.model.User;
import com.rentreturn.backend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initUser(UserRepository userRepository) {
        return args -> {
            if (userRepository.findByEmail("testuser@example.com").isEmpty()) {
                BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
                User user = User.builder()
                        .email("testuser@example.com")
                        .name("Test User")
                        .password(encoder.encode("testpassword123"))
                        .role("USER")
                        .build();
                userRepository.save(user);
                System.out.println("Test user created!");
            } else {
                System.out.println("Test user already exists.");
            }
        };
    }
}

