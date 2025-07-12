package com.arushr.rentreturn.service;

import com.arushr.rentreturn.enums.RentalStatus;
import com.arushr.rentreturn.enums.Role;
import com.arushr.rentreturn.model.Product;
import com.arushr.rentreturn.model.Rental;
import com.arushr.rentreturn.model.User;
import com.arushr.rentreturn.repository.RentalRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RentalServiceImplTest {

    @Mock
    private RentalRepository rentalRepository;

    @InjectMocks
    private RentalServiceImpl rentalServiceImpl;

    private Rental rental;
    private User user;
    private Product product;
    private LocalDateTime now;

    @BeforeEach
    void setUp() {
        now = LocalDateTime.now();
        
        user = User.builder()
            .id(1L)
            .username("testuser")
            .email("test@example.com")
            .role(Role.USER)
            .build();

        product = Product.builder()
            .id(1L)
            .name("Test Product")
            .pricePerDay(new BigDecimal("10.00"))
            .category("Electronics")
            .available(true)
            .deleted(false)
            .build();

        rental = Rental.builder()
            .id(1L)
            .user(user)
            .product(product)
            .rentalStart(now.minusDays(1))
            .rentalEnd(now.plusDays(6))
            .totalAmount(new BigDecimal("70.00"))
            .status(RentalStatus.ACTIVE)
            .deleted(false)
            .build();
    }

    @Test
    void testCreate() {
        when(rentalRepository.save(rental)).thenReturn(rental);
        
        Rental createdRental = rentalServiceImpl.create(rental);
        
        assertEquals(rental, createdRental);
        verify(rentalRepository, times(1)).save(rental);
    }

    @Test
    void testFindById() {
        when(rentalRepository.findById(1L)).thenReturn(Optional.of(rental));
        
        Optional<Rental> foundRental = rentalServiceImpl.findById(1L);
        
        assertTrue(foundRental.isPresent());
        assertEquals(rental, foundRental.get());
        verify(rentalRepository, times(1)).findById(1L);
    }

    @Test
    void testFindById_NotFound() {
        when(rentalRepository.findById(1L)).thenReturn(Optional.empty());
        
        Optional<Rental> foundRental = rentalServiceImpl.findById(1L);
        
        assertFalse(foundRental.isPresent());
        verify(rentalRepository, times(1)).findById(1L);
    }

    @Test
    void testFindById_FilterDeletedRental() {
        rental.setDeleted(true);
        when(rentalRepository.findById(1L)).thenReturn(Optional.of(rental));
        
        Optional<Rental> foundRental = rentalServiceImpl.findById(1L);
        
        assertFalse(foundRental.isPresent());
        verify(rentalRepository, times(1)).findById(1L);
    }

    @Test
    void testFindAll() {
        when(rentalRepository.findAllByDeletedFalse()).thenReturn(Arrays.asList(rental));
        
        List<Rental> rentals = rentalServiceImpl.findAll();
        
        assertFalse(rentals.isEmpty());
        assertEquals(1, rentals.size());
        verify(rentalRepository, times(1)).findAllByDeletedFalse();
    }

    @Test
    void testFindAll_Empty() {
        when(rentalRepository.findAllByDeletedFalse()).thenReturn(Collections.emptyList());
        
        List<Rental> rentals = rentalServiceImpl.findAll();
        
        assertTrue(rentals.isEmpty());
        verify(rentalRepository, times(1)).findAllByDeletedFalse();
    }

    @Test
    void testFindActive() {
        when(rentalRepository.findByStatus(RentalStatus.ACTIVE)).thenReturn(Arrays.asList(rental));
        
        List<Rental> activeRentals = rentalServiceImpl.findActive();
        
        assertFalse(activeRentals.isEmpty());
        assertEquals(1, activeRentals.size());
        verify(rentalRepository, times(1)).findByStatus(RentalStatus.ACTIVE);
    }

    @Test
    void testFindActive_FilterDeletedRentals() {
        Rental deletedRental = Rental.builder()
            .id(2L)
            .user(user)
            .product(product)
            .status(RentalStatus.ACTIVE)
            .deleted(true)
            .build();
        
        when(rentalRepository.findByStatus(RentalStatus.ACTIVE))
            .thenReturn(Arrays.asList(rental, deletedRental));
        
        List<Rental> activeRentals = rentalServiceImpl.findActive();
        
        assertEquals(1, activeRentals.size());
        assertEquals(rental, activeRentals.get(0));
        verify(rentalRepository, times(1)).findByStatus(RentalStatus.ACTIVE);
    }

    @Test
    void testFindByUserId() {
        when(rentalRepository.findAllByUserIdAndDeletedFalse(1L)).thenReturn(Arrays.asList(rental));
        
        List<Rental> userRentals = rentalServiceImpl.findByUserId(1L);
        
        assertFalse(userRentals.isEmpty());
        assertEquals(1, userRentals.size());
        verify(rentalRepository, times(1)).findAllByUserIdAndDeletedFalse(1L);
    }

    @Test
    void testFindByProductId() {
        when(rentalRepository.findAllByProductIdAndDeletedFalse(1L)).thenReturn(Arrays.asList(rental));
        
        List<Rental> productRentals = rentalServiceImpl.findByProductId(1L);
        
        assertFalse(productRentals.isEmpty());
        assertEquals(1, productRentals.size());
        verify(rentalRepository, times(1)).findAllByProductIdAndDeletedFalse(1L);
    }

    @Test
    void testMarkReturned() {
        when(rentalRepository.findById(1L)).thenReturn(Optional.of(rental));
        when(rentalRepository.save(rental)).thenReturn(rental);
        
        Rental returnedRental = rentalServiceImpl.markReturned(1L);
        
        assertEquals(RentalStatus.RETURNED, returnedRental.getStatus());
        verify(rentalRepository, times(1)).findById(1L);
        verify(rentalRepository, times(1)).save(rental);
    }

    @Test
    void testMarkReturned_RentalNotFound() {
        when(rentalRepository.findById(1L)).thenReturn(Optional.empty());
        
        assertThrows(RuntimeException.class, () -> {
            rentalServiceImpl.markReturned(1L);
        });
        
        verify(rentalRepository, times(1)).findById(1L);
        verify(rentalRepository, never()).save(any());
    }

    @Test
    void testExtendRental() {
        LocalDateTime originalEndDate = rental.getRentalEnd();
        when(rentalRepository.findById(1L)).thenReturn(Optional.of(rental));
        when(rentalRepository.save(rental)).thenAnswer(invocation -> {
            Rental savedRental = invocation.getArgument(0);
            // The service modifies the rental end date
            savedRental.setRentalEnd(originalEndDate.plusDays(3));
            return savedRental;
        });
        
        Rental extendedRental = rentalServiceImpl.extendRental(1L, 3);
        
        LocalDateTime expectedEndDate = originalEndDate.plusDays(3);
        assertEquals(expectedEndDate, extendedRental.getRentalEnd());
        verify(rentalRepository, times(1)).findById(1L);
        verify(rentalRepository, times(1)).save(rental);
    }

    @Test
    void testExtendRental_RentalNotFound() {
        when(rentalRepository.findById(1L)).thenReturn(Optional.empty());
        
        assertThrows(RuntimeException.class, () -> {
            rentalServiceImpl.extendRental(1L, 3);
        });
        
        verify(rentalRepository, times(1)).findById(1L);
        verify(rentalRepository, never()).save(any());
    }

    @Test
    void testExtendRental_NullRentalEnd() {
        rental.setRentalEnd(null);
        when(rentalRepository.findById(1L)).thenReturn(Optional.of(rental));
        
        assertThrows(RuntimeException.class, () -> {
            rentalServiceImpl.extendRental(1L, 3);
        });
        
        verify(rentalRepository, times(1)).findById(1L);
        verify(rentalRepository, never()).save(any());
    }

    @Test
    void testCancelRental() {
        when(rentalRepository.findById(1L)).thenReturn(Optional.of(rental));
        
        rentalServiceImpl.cancelRental(1L);
        
        assertTrue(rental.isDeleted());
        verify(rentalRepository, times(1)).findById(1L);
        verify(rentalRepository, times(1)).save(rental);
    }

    @Test
    void testCancelRental_RentalNotFound() {
        when(rentalRepository.findById(1L)).thenReturn(Optional.empty());
        
        rentalServiceImpl.cancelRental(1L);
        
        verify(rentalRepository, times(1)).findById(1L);
        verify(rentalRepository, never()).save(any());
    }

    @Test
    void testCountActive() {
        when(rentalRepository.findByStatus(RentalStatus.ACTIVE)).thenReturn(Arrays.asList(rental));
        
        long count = rentalServiceImpl.countActive();
        
        assertEquals(1L, count);
        verify(rentalRepository, times(1)).findByStatus(RentalStatus.ACTIVE);
    }

    @Test
    void testCountActive_FilterDeletedRentals() {
        Rental deletedRental = Rental.builder()
            .id(2L)
            .user(user)
            .product(product)
            .status(RentalStatus.ACTIVE)
            .deleted(true)
            .build();
        
        when(rentalRepository.findByStatus(RentalStatus.ACTIVE))
            .thenReturn(Arrays.asList(rental, deletedRental));
        
        long count = rentalServiceImpl.countActive();
        
        assertEquals(1L, count);
        verify(rentalRepository, times(1)).findByStatus(RentalStatus.ACTIVE);
    }

    @Test
    void testCountAll() {
        when(rentalRepository.countByDeletedFalse()).thenReturn(5L);
        
        long count = rentalServiceImpl.countAll();
        
        assertEquals(5L, count);
        verify(rentalRepository, times(1)).countByDeletedFalse();
    }

    @Test
    void testFindOverdueRentals() {
        LocalDateTime overdueTime = now.minusDays(1);
        when(rentalRepository.findAllByRentalEndBeforeAndStatusNotAndDeletedFalse(
            overdueTime, RentalStatus.RETURNED)).thenReturn(Arrays.asList(rental));
        
        List<Rental> overdueRentals = rentalServiceImpl.findOverdueRentals(overdueTime);
        
        assertFalse(overdueRentals.isEmpty());
        assertEquals(1, overdueRentals.size());
        verify(rentalRepository, times(1))
            .findAllByRentalEndBeforeAndStatusNotAndDeletedFalse(overdueTime, RentalStatus.RETURNED);
    }

    @Test
    void testFindByStatus() {
        when(rentalRepository.findByStatus(RentalStatus.ACTIVE)).thenReturn(Arrays.asList(rental));
        
        List<Rental> activeRentals = rentalServiceImpl.findByStatus(RentalStatus.ACTIVE);
        
        assertFalse(activeRentals.isEmpty());
        assertEquals(1, activeRentals.size());
        verify(rentalRepository, times(1)).findByStatus(RentalStatus.ACTIVE);
    }

    @Test
    void testFindByStatus_FilterDeletedRentals() {
        Rental deletedRental = Rental.builder()
            .id(2L)
            .user(user)
            .product(product)
            .status(RentalStatus.ACTIVE)
            .deleted(true)
            .build();
        
        when(rentalRepository.findByStatus(RentalStatus.ACTIVE))
            .thenReturn(Arrays.asList(rental, deletedRental));
        
        List<Rental> activeRentals = rentalServiceImpl.findByStatus(RentalStatus.ACTIVE);
        
        assertEquals(1, activeRentals.size());
        assertEquals(rental, activeRentals.get(0));
        verify(rentalRepository, times(1)).findByStatus(RentalStatus.ACTIVE);
    }

    @Test
    void testFindByRentalStartBetween() {
        LocalDateTime startDate = now.minusDays(2);
        LocalDateTime endDate = now;
        
        when(rentalRepository.findByRentalStartBetween(startDate, endDate))
            .thenReturn(Arrays.asList(rental));
        
        List<Rental> rentals = rentalServiceImpl.findByRentalStartBetween(startDate, endDate);
        
        assertFalse(rentals.isEmpty());
        assertEquals(1, rentals.size());
        verify(rentalRepository, times(1)).findByRentalStartBetween(startDate, endDate);
    }

    @Test
    void testFindByRentalStartBetween_FilterDeletedRentals() {
        LocalDateTime startDate = now.minusDays(2);
        LocalDateTime endDate = now;
        
        Rental deletedRental = Rental.builder()
            .id(2L)
            .user(user)
            .product(product)
            .rentalStart(now.minusDays(1))
            .deleted(true)
            .build();
        
        when(rentalRepository.findByRentalStartBetween(startDate, endDate))
            .thenReturn(Arrays.asList(rental, deletedRental));
        
        List<Rental> rentals = rentalServiceImpl.findByRentalStartBetween(startDate, endDate);
        
        assertEquals(1, rentals.size());
        assertEquals(rental, rentals.get(0));
        verify(rentalRepository, times(1)).findByRentalStartBetween(startDate, endDate);
    }
}
