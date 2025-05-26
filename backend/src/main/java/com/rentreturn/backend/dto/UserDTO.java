package com.rentreturn.backend.dto;

import com.rentreturn.backend.model.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {

    long id;

    String name;

    String email;

    String phone;

    String address;

    LocalDateTime createdAt;

    public UserDTO(User user) {
        this.id = user.getId();
        this.name = user.getName();
        this.email = user.getEmail();
        this.phone = user.getPhone();
        this.address = user.getAddress();
        this.createdAt = user.getCreatedAt();
    }


}
