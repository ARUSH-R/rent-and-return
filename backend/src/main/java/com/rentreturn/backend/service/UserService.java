package com.rentreturn.backend.service;

import com.rentreturn.backend.dto.UserCreateRequest;
import com.rentreturn.backend.dto.UserDTO;
import com.rentreturn.backend.model.User;

import java.util.List;
import java.util.Optional;

public interface UserService {

    UserDTO createUser(UserCreateRequest userRequest);

    UserDTO getUserById(int id);

    List<UserDTO> getAllUsers();

    void deleteUser(int id);

    Optional<User> findByEmail(String email);




}
