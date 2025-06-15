// ...existing code...

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

    // Consider using an enum for roles for type safety:
    // public enum Role { USER, ADMIN }
    // @Enumerated(EnumType.STRING)
    // private Role role;
    @Column(nullable = false)
    private String role; // e.g. "USER" or "ADMIN"

    @Size(min = 10, max = 15)
    @Column(unique = true)
    private String phone;

    // ...existing code...

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // Prefix role with "ROLE_" if not already present, handle null
        String roleName = (role != null && role.startsWith("ROLE_")) ? role : "ROLE_" + (role != null ? role : "USER");
        return List.of(new SimpleGrantedAuthority(roleName));
    }

    // ...existing code...

    // @PrePersist and @PreUpdate are optional if using @CreationTimestamp/@UpdateTimestamp
    // Remove if not needed, as Hibernate will handle timestamps.

    // ...existing code...
