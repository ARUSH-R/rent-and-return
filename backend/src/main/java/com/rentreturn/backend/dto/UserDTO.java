package com.rentreturn.backend.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.rentreturn.backend.model.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


import java.time.LocalDateTime;

@JsonInclude(JsonInclude.Include.NON_NULL)

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {

    private long id;

    private String name;

    private String email;

    private String phone;

    private String address;

    LocalDateTime createdAt;

    public UserDTO(User user) {
        this.id = user.getId();
        this.name = user.getName();
        this.email = user.getEmail();
        this.phone = user.getPhone() != null ? user.getPhone() : "Not provided";
        this.address = user.getAddress() != null ? user.getAddress() : "Not provided";
        this.createdAt = user.getCreatedAt() != null ? user.getCreatedAt() : LocalDateTime.now();
    }


}
