package com.rentreturn.backend.model;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
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

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(min = 2, max = 50)
    @Column(nullable = false)
    private String name;

    @Email
    @NotBlank
    @Column(unique = true, nullable = false)
    private String email;

    @JsonIgnore
    @NotBlank
    @Size(min = 6)
    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String role; // e.g. "USER" or "ADMIN"

    @Size(min = 10, max = 15)
    @Column(unique = true)
    private String phone;

    private String address;

    private String profileImageUrl; // Optional: URL to user's profile image

    /**
     * -- GETTER --
     *  Returns true if the user's email is verified.
     */
    private boolean emailVerified = false; // Optional: Email verification status

    /**
     * -- GETTER --
     *  Returns true if the user is soft-deleted.
     */
    private boolean deleted = false; // Soft delete flag

    private String createdBy; // Optional: who created the user
    private String updatedBy; // Optional: who last updated the user

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    private LocalDateTime lastLoginAt; // Track last login time

    @JsonIgnore
    private String resetPasswordToken; // For password reset functionality

    @JsonIgnore
    private boolean enabled = true;
    @JsonIgnore
    private boolean accountNonLocked = true;

    // Implement UserDetails methods

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // Prefix role with "ROLE_" if not already present
        String roleName = role.startsWith("ROLE_") ? role : "ROLE_" + role;
        return List.of(new SimpleGrantedAuthority(roleName));
    }

    @Override
    public String getUsername() {
        return email; // using email as username
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

    /**
     * Optional: Update user details except for sensitive fields.
     */
    public void updateProfile(String name, String phone, String address, String profileImageUrl) {
        this.name = name;
        this.phone = phone;
        this.address = address;
        this.profileImageUrl = profileImageUrl;
    }

    /**
     * Mark the user's email as verified.
     */
    public void verifyEmail() {
        this.emailVerified = true;
    }

    /**
     * Returns true if the user has admin role.
     */
    public boolean isAdmin() {
        return role != null && (role.equalsIgnoreCase("ADMIN") || role.equalsIgnoreCase("ROLE_ADMIN"));
    }

    /**
     * Soft deletes the user.
     */
    public void softDelete() {
        this.deleted = true;
        this.enabled = false;
    }

    /**
     * Restores a soft-deleted user.
     */
    public void restore() {
        this.deleted = false;
        this.enabled = true;
    }

    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", name='" + name + '\'' +
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
