package com.rentreturn.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {

    int id;

    String name;

    String email;

    String phone;

    String address;

    LocalDateTime createdAt;


}
