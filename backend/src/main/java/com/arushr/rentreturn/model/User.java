package com.arushr.rentreturn.model;

import com.arushr.rentreturn.enums.Role;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.io.Serial;
import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User implements UserDetails, Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(min = 2, max = 50)
    @Column(nullable = false, unique = true)
    private String username;

    @Email
    @NotBlank
    @Column(unique = true, nullable = false)
    private String email;

    @JsonIgnore
    @NotBlank
    @Size(min = 6)
    @Column(nullable = false)
    private String password;

    @Size(min = 10, max = 15)
    @Column(unique = true)
    private String phone;

    private String address;

    private String profileImageUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Builder.Default
    private boolean emailVerified = false;

    @Builder.Default
    private boolean deleted = false;

    private String createdBy;
    private String updatedBy;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    private LocalDateTime lastLoginAt;

    @JsonIgnore
    private String resetPasswordToken;

    @JsonIgnore
    @Builder.Default
    private boolean enabled = true;

    @JsonIgnore
    @Builder.Default
    private boolean accountNonLocked = true;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        String roleName = role != null ? "ROLE_" + role.name() : "ROLE_USER";
        return List.of(new SimpleGrantedAuthority(roleName));
    }

    @Override
    public String getUsername() {
        return username; // return the actual username field
    }
    public String getEmail() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return accountNonLocked;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return enabled;
    }

    // Add these methods for clarity in tests and business logic
    public String getActualUsername() {
        return this.username;
    }
    public String getActualEmail() {
        return this.email;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.enabled = true;
        this.accountNonLocked = true;
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public void updateProfile(String name, String phone, String address, String profileImageUrl) {
        this.username = name;
        this.phone = phone;
        this.address = address;
        this.profileImageUrl = profileImageUrl;
    }

    public void verifyEmail() {
        this.emailVerified = true;
    }

    public boolean isAdmin() {
        return role != null && role == Role.ADMIN;
    }

    public void softDelete() {
        this.deleted = true;
        this.enabled = false;
    }

    public void restore() {
        this.deleted = false;
        this.enabled = true;
    }

    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", username='" + username + '\'' +
                ", email='" + email + '\'' +
                ", role='" + role + '\'' +
                ", phone='" + phone + '\'' +
                ", address='" + address + '\'' +
                ", profileImageUrl='" + profileImageUrl + '\'' +
                ", emailVerified=" + emailVerified +
                ", deleted=" + deleted +
                ", createdBy='" + createdBy + '\'' +
                ", updatedBy='" + updatedBy + '\'' +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                ", lastLoginAt=" + lastLoginAt +
                '}';
    }

}