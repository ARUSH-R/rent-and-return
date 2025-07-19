package com.arushr.rentreturn.dto.user;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class AddressDTO {
    @NotBlank
    private String name;
    @NotBlank
    private String phone;
    @NotBlank
    private String addressLine1;
    private String addressLine2;
    @NotBlank
    private String city;
    @NotBlank
    private String state;
    @NotBlank
    private String postalCode;
    @NotBlank
    private String country;
    private boolean isDefault;
} 