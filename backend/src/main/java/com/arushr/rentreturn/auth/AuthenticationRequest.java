package com.arushr.rentreturn.auth;

import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AuthenticationRequest {
    private String identifier; // username, email, or phone
    private String password;
    // For backward compatibility
    public String getEmail() { return identifier; }
    public void setEmail(String email) { this.identifier = email; }
    public String getIdentifier() { return identifier; }
    public void setIdentifier(String identifier) { this.identifier = identifier; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}
