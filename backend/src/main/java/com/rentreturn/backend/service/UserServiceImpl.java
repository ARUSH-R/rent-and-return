package com.rentreturn.backend.service;

import com.rentreturn.backend.dto.UserCreateRequest;
import com.rentreturn.backend.dto.UserDTO;
import com.rentreturn.backend.exception.UserNotFoundException;
import com.rentreturn.backend.mapper.UserMapper;
import com.rentreturn.backend.model.User;
import com.rentreturn.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDTO createUser(UserCreateRequest userRequest) {
        User user = UserMapper.toUser(userRequest);
        User savedUser = userRepository.save(user);
        return UserMapper.toUserDTO(savedUser);
    }

    @Override
    public UserDTO getUserById(int id) {
        User user = userRepository.findById((long) id)
                .orElseThrow(() -> new UserNotFoundException("User with ID " + id + " not found"));
        return UserMapper.toUserDTO(user);
    }

    @Override
    public List<UserDTO> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(UserMapper::toUserDTO)
                .toList();
    }

    @Override
    public void deleteUser(int id) {
        userRepository.deleteById((long) id);
    }

    // Removed @Override here
    public UserDetails loadUserByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
        return user; // Assumes User implements UserDetails
    }
}