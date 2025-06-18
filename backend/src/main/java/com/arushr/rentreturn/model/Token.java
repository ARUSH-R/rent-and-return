package com.arushr.rentreturn.model;

import com.arushr.rentreturn.enums.TokenType;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.io.Serial;
import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * Token entity for managing user JWT refresh tokens.
 */
@Entity
@Table(name = "tokens")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Token implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false, unique = true, length = 512)
    private String token;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private TokenType tokenType = TokenType.BEARER;

    @Column(nullable = false)
    private boolean revoked = false;

    @Column(nullable = false)
    private boolean expired = false;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Version
    private Long version;

    @Size(max = 50)
    @Column(length = 50)
    private String createdBy;

    @Size(max = 50)
    @Column(length = 50)
    private String updatedBy;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    /**
     * Soft expire the token.
     */
    public void expire() {
        this.expired = true;
    }

    /**
     * Revoke the token.
     */
    public void revoke() {
        this.revoked = true;
    }

    /**
     * Reactivates the token (if your business logic allows).
     */
    public void reactivate() {
        this.revoked = false;
        this.expired = false;
    }

    /**
     * Update audit fields.
     */
    public void updateAudit(String updater) {
        if (updater != null) {
            this.updatedBy = updater;
        }
        this.updatedAt = LocalDateTime.now();
    }

    /**
     * Returns true if the token is active (not revoked and not expired).
     */
    public boolean isActive() {
        return !this.revoked && !this.expired;
    }

    /**
     * Checks if this token belongs to the given user.
     */
    public boolean belongsTo(User user) {
        return this.user != null && user != null && this.user.getId().equals(user.getId());
    }

    @Override
    public String toString() {
        return "Token{" +
                "id=" + id +
                ", tokenType=" + tokenType +
                ", revoked=" + revoked +
                ", expired=" + expired +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Token token)) return false;
        return id != null && id.equals(token.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}
