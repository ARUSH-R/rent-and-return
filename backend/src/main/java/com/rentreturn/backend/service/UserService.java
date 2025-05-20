package com.rentreturn.backend.service;

import com.rentreturn.backend.model.User;

import java.util.List;

public interface UserService {

    User createUser(User user);

    User getUserById(int id);

    List<User> getAllUsers();

    void deleteUser(int id);
}
