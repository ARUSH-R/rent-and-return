package com.arushr.rentreturn.service;

import com.arushr.rentreturn.enums.Role;
import com.arushr.rentreturn.model.User;
import com.arushr.rentreturn.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserServiceImpl userServiceImpl;

    private User user;
    private User adminUser;

    @BeforeEach
    void setUp() {
        user = User.builder()
            .id(1L)
            .username("testuser")
            .email("test@example.com")
            .password("password123")
            .phone("1234567890")
            .address("123 Test Street")
            .role(Role.USER)
            .emailVerified(true)
            .enabled(true)
            .deleted(false)
            .build();

        adminUser = User.builder()
            .id(2L)
            .username("adminuser")
            .email("admin@example.com")
            .password("adminpassword")
            .role(Role.ADMIN)
            .emailVerified(true)
            .enabled(true)
            .deleted(false)
            .build();
    }

    @Test
    void testLoadUserByUsername() {
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(user));
        
        UserDetails userDetails = userServiceImpl.loadUserByUsername("test@example.com");
        
        assertNotNull(userDetails);
        assertEquals("test@example.com", userDetails.getUsername());
        assertTrue(userDetails.isEnabled());
        assertTrue(userDetails.getAuthorities().stream()
            .anyMatch(auth -> auth.getAuthority().equals("ROLE_USER")));
        
        verify(userRepository, times(1)).findByEmail("test@example.com");
    }

    @Test
    void testLoadUserByUsername_UserNotFound() {
        when(userRepository.findByEmail("notfound@example.com")).thenReturn(Optional.empty());
        
        assertThrows(UsernameNotFoundException.class, () -> {
            userServiceImpl.loadUserByUsername("notfound@example.com");
        });
        
        verify(userRepository, times(1)).findByEmail("notfound@example.com");
    }

    @Test
    void testRegister() {
        when(userRepository.save(user)).thenReturn(user);
        
        User registeredUser = userServiceImpl.register(user);
        
        assertEquals(user, registeredUser);
        verify(userRepository, times(1)).save(user);
    }

    @Test
    void testFindById() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        
        Optional<User> foundUser = userServiceImpl.findById(1L);
        
        assertTrue(foundUser.isPresent());
        assertEquals(user, foundUser.get());
        verify(userRepository, times(1)).findById(1L);
    }

    @Test
    void testFindById_NotFound() {
        when(userRepository.findById(1L)).thenReturn(Optional.empty());
        
        Optional<User> foundUser = userServiceImpl.findById(1L);
        
        assertFalse(foundUser.isPresent());
        verify(userRepository, times(1)).findById(1L);
    }

    @Test
    void testFindById_FilterDeletedUser() {
        user.setDeleted(true);
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        
        Optional<User> foundUser = userServiceImpl.findById(1L);
        
        assertFalse(foundUser.isPresent());
        verify(userRepository, times(1)).findById(1L);
    }

    @Test
    void testFindByEmail() {
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(user));
        
        Optional<User> foundUser = userServiceImpl.findByEmail("test@example.com");
        
        assertTrue(foundUser.isPresent());
        assertEquals(user, foundUser.get());
        verify(userRepository, times(1)).findByEmail("test@example.com");
    }

    @Test
    void testFindByEmail_FilterDeletedUser() {
        user.setDeleted(true);
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(user));
        
        Optional<User> foundUser = userServiceImpl.findByEmail("test@example.com");
        
        assertFalse(foundUser.isPresent());
        verify(userRepository, times(1)).findByEmail("test@example.com");
    }

    @Test
    void testFindAll() {
        when(userRepository.findAll()).thenReturn(Arrays.asList(user, adminUser));
        
        List<User> users = userServiceImpl.findAll();
        
        assertFalse(users.isEmpty());
        assertEquals(2, users.size());
        verify(userRepository, times(1)).findAll();
    }

    @Test
    void testFindAllActiveUsers() {
        when(userRepository.findAllByDeletedFalse()).thenReturn(Arrays.asList(user, adminUser));
        
        List<User> users = userServiceImpl.findAllActiveUsers();
        
        assertFalse(users.isEmpty());
        assertEquals(2, users.size());
        verify(userRepository, times(1)).findAllByDeletedFalse();
    }

    @Test
    void testUpdateUser() {
        User updatedUser = User.builder()
            .username("updateduser")
            .phone("9876543210")
            .build();

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        // Return the updated user object from the save mock
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));
        
        User result = userServiceImpl.updateUser(1L, updatedUser);
        
        // Assert only on updated fields
        assertEquals("updateduser", result.getUsername());
        assertEquals("9876543210", result.getPhone());
        // Optionally, check the id remains the same
        assertEquals(1L, result.getId());
        verify(userRepository, times(1)).findById(1L);
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void testUpdateUser_UserNotFound() {
        when(userRepository.findById(1L)).thenReturn(Optional.empty());
        
        assertThrows(RuntimeException.class, () -> {
            userServiceImpl.updateUser(1L, user);
        });
        
        verify(userRepository, times(1)).findById(1L);
        verify(userRepository, never()).save(any());
    }

    @Test
    void testSoftDeleteUser() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        
        userServiceImpl.softDeleteUser(1L);
        
        assertTrue(user.isDeleted());
        verify(userRepository, times(1)).findById(1L);
        verify(userRepository, times(1)).save(user);
    }

    @Test
    void testSoftDeleteUser_UserNotFound() {
        when(userRepository.findById(1L)).thenReturn(Optional.empty());
        
        userServiceImpl.softDeleteUser(1L);
        
        verify(userRepository, times(1)).findById(1L);
        verify(userRepository, never()).save(any());
    }

    @Test
    void testExistsByEmail() {
        when(userRepository.existsByEmail("test@example.com")).thenReturn(true);
        
        boolean exists = userServiceImpl.existsByEmail("test@example.com");
        
        assertTrue(exists);
        verify(userRepository, times(1)).existsByEmail("test@example.com");
    }

    @Test
    void testExistsByUsername() {
        when(userRepository.existsByUsername("testuser")).thenReturn(true);
        
        boolean exists = userServiceImpl.existsByUsername("testuser");
        
        assertTrue(exists);
        verify(userRepository, times(1)).existsByUsername("testuser");
    }

    @Test
    void testFindByPhone() {
        when(userRepository.findByPhone("1234567890")).thenReturn(Optional.of(user));
        
        Optional<User> foundUser = userServiceImpl.findByPhone("1234567890");
        
        assertTrue(foundUser.isPresent());
        assertEquals(user, foundUser.get());
        verify(userRepository, times(1)).findByPhone("1234567890");
    }

    @Test
    void testFindByPhone_FilterDeletedUser() {
        user.setDeleted(true);
        when(userRepository.findByPhone("1234567890")).thenReturn(Optional.of(user));
        
        Optional<User> foundUser = userServiceImpl.findByPhone("1234567890");
        
        assertFalse(foundUser.isPresent());
        verify(userRepository, times(1)).findByPhone("1234567890");
    }

    @Test
    void testFindByUsername() {
        // Create a fresh user to avoid interference from other tests
        User testUser = User.builder()
            .id(1L)
            .username("testuser")
            .email("test@example.com")
            .role(Role.USER)
            .deleted(false)
            .build();
        when(userRepository.findAll()).thenReturn(Arrays.asList(testUser, adminUser));

        Optional<User> foundUser = userServiceImpl.findByUsername("testuser");

        if (foundUser.isEmpty()) {
            System.out.println("DEBUG: userRepository.findAll() returned: " + Arrays.asList(testUser, adminUser));
            System.out.println("DEBUG: Searched for username: testuser");
        }
        assertTrue(foundUser.isPresent(), "User with username 'testuser' should be found");
        assertEquals("testuser", foundUser.get().getUsername());
        assertEquals(1L, foundUser.get().getId());
        verify(userRepository, times(1)).findAll();
    }

    @Test
    void testFindByUsername_FilterDeletedUser() {
        user.setDeleted(true);
        when(userRepository.findAll()).thenReturn(Arrays.asList(user, adminUser));
        
        Optional<User> foundUser = userServiceImpl.findByUsername("testuser");
        
        assertFalse(foundUser.isPresent());
        verify(userRepository, times(1)).findAll();
    }

    @Test
    void testFindAllByRole() {
        when(userRepository.findAllByRole("USER")).thenReturn(Arrays.asList(user));
        
        List<User> users = userServiceImpl.findAllByRole("USER");
        
        assertFalse(users.isEmpty());
        assertEquals(1, users.size());
        verify(userRepository, times(1)).findAllByRole("USER");
    }

    @Test
    void testFindAllByEmailVerified() {
        when(userRepository.findAllByEmailVerified(true)).thenReturn(Arrays.asList(user, adminUser));
        
        List<User> users = userServiceImpl.findAllByEmailVerified(true);
        
        assertFalse(users.isEmpty());
        assertEquals(2, users.size());
        verify(userRepository, times(1)).findAllByEmailVerified(true);
    }

    @Test
    void testFindAllByEnabled() {
        when(userRepository.findAllByEnabled(true)).thenReturn(Arrays.asList(user, adminUser));
        
        List<User> users = userServiceImpl.findAllByEnabled(true);
        
        assertFalse(users.isEmpty());
        assertEquals(2, users.size());
        verify(userRepository, times(1)).findAllByEnabled(true);
    }

    @Test
    void testFindAllByDeleted() {
        when(userRepository.findAllByDeleted(false)).thenReturn(Arrays.asList(user, adminUser));
        
        List<User> users = userServiceImpl.findAllByDeleted(false);
        
        assertFalse(users.isEmpty());
        assertEquals(2, users.size());
        verify(userRepository, times(1)).findAllByDeleted(false);
    }

    @Test
    void testSearchByNameOrEmail() {
        when(userRepository.findByUsernameContainingIgnoreCaseOrEmailContainingIgnoreCase("test", "test"))
            .thenReturn(Arrays.asList(user));
        
        List<User> users = userServiceImpl.searchByNameOrEmail("test");
        
        assertFalse(users.isEmpty());
        assertEquals(1, users.size());
        verify(userRepository, times(1))
            .findByUsernameContainingIgnoreCaseOrEmailContainingIgnoreCase("test", "test");
    }

    @Test
    void testFindAllCreatedAfter() {
        LocalDateTime date = LocalDateTime.now().minusDays(1);
        when(userRepository.findAllByCreatedAtAfter(date)).thenReturn(Arrays.asList(user));
        
        List<User> users = userServiceImpl.findAllCreatedAfter(date);
        
        assertFalse(users.isEmpty());
        assertEquals(1, users.size());
        verify(userRepository, times(1)).findAllByCreatedAtAfter(date);
    }

    @Test
    void testCountByRole() {
        when(userRepository.countByRole("USER")).thenReturn(5L);
        
        long count = userServiceImpl.countByRole("USER");
        
        assertEquals(5L, count);
        verify(userRepository, times(1)).countByRole("USER");
    }

    @Test
    void testFindAllByRoleIn() {
        List<String> roles = Arrays.asList("USER", "ADMIN");
        when(userRepository.findAll()).thenReturn(Arrays.asList(user, adminUser));

        List<User> users = userServiceImpl.findAllByRoleIn(roles);

        assertFalse(users.isEmpty());
        assertEquals(2, users.size());
        verify(userRepository, times(1)).findAll();
    }

    @Test
    void testCountByEnabled() {
        when(userRepository.findAllByEnabled(true)).thenReturn(Arrays.asList(user, adminUser));
        
        long count = userServiceImpl.countByEnabled(true);
        
        assertEquals(2L, count);
        verify(userRepository, times(1)).findAllByEnabled(true);
    }
}
