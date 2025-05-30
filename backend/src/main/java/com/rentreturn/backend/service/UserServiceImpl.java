package com.rentreturn.backend.service;

import com.rentreturn.backend.dto.PasswordChangeRequest;
import com.rentreturn.backend.dto.UserCreateRequest;
import com.rentreturn.backend.dto.UserDTO;
import com.rentreturn.backend.dto.UserUpdateRequest;
import com.rentreturn.backend.exception.UserNotFoundException;
import com.rentreturn.backend.mapper.UserMapper;
import com.rentreturn.backend.model.User;
import com.rentreturn.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private final PasswordEncoder passwordEncoder;

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

    @Override
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    @Override
    public UserDTO updateUser(String email, UserUpdateRequest updateRequest) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        user.setName(updateRequest.getName());
        user.setPhone(updateRequest.getPhone());
        user.setAddress(updateRequest.getAddress());
        userRepository.save(user);
        return new UserDTO(user);
    }

    @Override
    public void changePassword(String email, PasswordChangeRequest passwordChangeRequest) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        if (!passwordEncoder.matches(passwordChangeRequest.getOldPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Old password is incorrect");
        }
        user.setPassword(passwordEncoder.encode(passwordChangeRequest.getNewPassword()));
        userRepository.save(user);
    }



}