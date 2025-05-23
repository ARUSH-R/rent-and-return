package com.rentreturn.backend.service;

import com.rentreturn.backend.dto.UserCreateRequest;
import com.rentreturn.backend.dto.UserDTO;
import com.rentreturn.backend.model.User;

import java.util.List;

public interface UserService {

    UserDTO createUser(UserCreateRequest userRequest);

    UserDTO getUserById(int id);

    List<UserDTO> getAllUsers();

    void deleteUser(int id);
}
