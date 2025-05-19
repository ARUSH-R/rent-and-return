package com.ecommerce.backend.service;

import com.ecommerce.backend.model.User;

import java.util.List;

public interface UserService {

    User createUser(User user);

    User getUserById(int id);

    List<User> getAllUsers();

    void deleteUser(int id);
}
