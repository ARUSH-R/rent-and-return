package com.arushr.rentreturn.service;

import com.arushr.rentreturn.model.Product;
import com.arushr.rentreturn.model.User;
import com.arushr.rentreturn.repository.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProductServiceImplTest {

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private ProductServiceImpl productServiceImpl;

    private Product product;
    private User owner;

    @BeforeEach
    void setUp() {
        owner = User.builder()
            .id(1L)
            .username("testuser")
            .email("test@example.com")
            .build();

        product = Product.builder()
            .id(1L)
            .name("Test Product")
            .description("Test Description")
            .pricePerDay(new BigDecimal("10.00"))
            .stock(100)
            .category("Electronics")
            .imageUrl("http://example.com/image.png")
            .available(true)
            .deleted(false)
            .owner(owner)
            .createdBy("testuser")
            .updatedBy("testuser")
            .build();
    }

    @Test
    void testCreate() {
        when(productRepository.save(product)).thenReturn(product);
        Product created = productServiceImpl.create(product);
        assertEquals(product, created);
        verify(productRepository, times(1)).save(product);
    }

    @Test
    void testFindById() {
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        Optional<Product> found = productServiceImpl.findById(1L);
        assertTrue(found.isPresent());
        assertEquals(product, found.get());
        verify(productRepository, times(1)).findById(1L);
    }

    @Test
    void testFindById_NotFound() {
        when(productRepository.findById(1L)).thenReturn(Optional.empty());
        Optional<Product> found = productServiceImpl.findById(1L);
        assertFalse(found.isPresent());
        verify(productRepository, times(1)).findById(1L);
    }

    @Test
    void testFindById_FilterDeletedProduct() {
        product.setDeleted(true);
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        Optional<Product> found = productServiceImpl.findById(1L);
        assertFalse(found.isPresent());
        verify(productRepository, times(1)).findById(1L);
    }

    @Test
    void testFindAll() {
        when(productRepository.findAllByDeletedFalse()).thenReturn(Arrays.asList(product));
        List<Product> products = productServiceImpl.findAll();
        assertFalse(products.isEmpty());
        assertEquals(1, products.size());
        verify(productRepository, times(1)).findAllByDeletedFalse();
    }

    @Test
    void testFindAll_Empty() {
        when(productRepository.findAllByDeletedFalse()).thenReturn(Collections.emptyList());
        List<Product> products = productServiceImpl.findAll();
        assertTrue(products.isEmpty());
        verify(productRepository, times(1)).findAllByDeletedFalse();
    }

    @Test
    void testFindAvailable() {
        when(productRepository.findAllByAvailableTrueAndDeletedFalse()).thenReturn(Arrays.asList(product));
        List<Product> products = productServiceImpl.findAvailable();
        assertFalse(products.isEmpty());
        assertEquals(1, products.size());
        verify(productRepository, times(1)).findAllByAvailableTrueAndDeletedFalse();
    }

    @Test
    void testUpdateProduct() {
        Product updatedProduct = Product.builder()
            .name("Updated Product")
            .description("Updated Description")
            .pricePerDay(new BigDecimal("15.00"))
            .category("Updated Category")
            .stock(50)
            .available(false)
            .imageUrl("http://example.com/updated.png")
            .owner(owner)
            .createdBy("testuser")
            .updatedBy("updateduser")
            .build();

        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(productRepository.save(product)).thenReturn(product);
        
        Product result = productServiceImpl.updateProduct(1L, updatedProduct);
        
        assertEquals("Updated Product", result.getName());
        assertEquals("Updated Description", result.getDescription());
        assertEquals(new BigDecimal("15.00"), result.getPricePerDay());
        assertEquals("Updated Category", result.getCategory());
        assertEquals(50, result.getStock());
        assertFalse(result.isAvailable());
        assertEquals("http://example.com/updated.png", result.getImageUrl());
        assertEquals("updateduser", result.getUpdatedBy());
        
        verify(productRepository, times(1)).findById(1L);
        verify(productRepository, times(1)).save(product);
    }

    @Test
    void testUpdateProduct_ProductNotFound() {
        when(productRepository.findById(1L)).thenReturn(Optional.empty());
        
        assertThrows(RuntimeException.class, () -> {
            productServiceImpl.updateProduct(1L, product);
        });
        
        verify(productRepository, times(1)).findById(1L);
        verify(productRepository, never()).save(any());
    }

    @Test
    void testSoftDeleteProduct() {
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        productServiceImpl.softDeleteProduct(1L);
        assertTrue(product.isDeleted());
        assertFalse(product.isAvailable());
        verify(productRepository, times(1)).findById(1L);
        verify(productRepository, times(1)).save(product);
    }

    @Test
    void testSoftDeleteProduct_ProductNotFound() {
        when(productRepository.findById(1L)).thenReturn(Optional.empty());
        productServiceImpl.softDeleteProduct(1L);
        verify(productRepository, times(1)).findById(1L);
        verify(productRepository, never()).save(any());
    }

    @Test
    void testFindByCategory() {
        when(productRepository.findByCategoryIgnoreCaseAndDeletedFalse("Electronics")).thenReturn(Arrays.asList(product));
        List<Product> products = productServiceImpl.findByCategory("Electronics");
        assertFalse(products.isEmpty());
        assertEquals(1, products.size());
        verify(productRepository, times(1)).findByCategoryIgnoreCaseAndDeletedFalse("Electronics");
    }

    @Test
    void testSearchByName() {
        when(productRepository.findByNameContainingIgnoreCaseAndDeletedFalse("Test")).thenReturn(Arrays.asList(product));
        List<Product> products = productServiceImpl.searchByName("Test");
        assertFalse(products.isEmpty());
        assertEquals(1, products.size());
        verify(productRepository, times(1)).findByNameContainingIgnoreCaseAndDeletedFalse("Test");
    }

    @Test
    void testFindByOwner() {
        when(productRepository.findByOwnerIdAndDeletedFalse(1L)).thenReturn(Arrays.asList(product));
        List<Product> products = productServiceImpl.findByOwner(1L);
        assertFalse(products.isEmpty());
        assertEquals(1, products.size());
        verify(productRepository, times(1)).findByOwnerIdAndDeletedFalse(1L);
    }

    @Test
    void testFindAllByDeleted() {
        when(productRepository.findAllByDeleted(true)).thenReturn(Arrays.asList(product));
        List<Product> products = productServiceImpl.findAllByDeleted(true);
        assertFalse(products.isEmpty());
        assertEquals(1, products.size());
        verify(productRepository, times(1)).findAllByDeleted(true);
    }

    @Test
    void testCountAll() {
        when(productRepository.countByDeletedFalse()).thenReturn(5L);
        long count = productServiceImpl.countAll();
        assertEquals(5L, count);
        verify(productRepository, times(1)).countByDeletedFalse();
    }

    @Test
    void testCountAvailable() {
        when(productRepository.countByAvailableTrueAndDeletedFalse()).thenReturn(3L);
        long count = productServiceImpl.countAvailable();
        assertEquals(3L, count);
        verify(productRepository, times(1)).countByAvailableTrueAndDeletedFalse();
    }

    @Test
    void testUpdateAvailability() {
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(productRepository.save(product)).thenReturn(product);
        
        Product result = productServiceImpl.updateAvailability(1L, false);
        
        assertFalse(result.isAvailable());
        verify(productRepository, times(1)).findById(1L);
        verify(productRepository, times(1)).save(product);
    }

    @Test
    void testUpdateAvailability_ProductNotFound() {
        when(productRepository.findById(1L)).thenReturn(Optional.empty());
        
        assertThrows(RuntimeException.class, () -> {
            productServiceImpl.updateAvailability(1L, false);
        });
        
        verify(productRepository, times(1)).findById(1L);
        verify(productRepository, never()).save(any());
    }
}

