package com.arushr.rentreturn.service;

import com.arushr.rentreturn.model.Product;
import com.arushr.rentreturn.repository.ProductRepository;
import com.arushr.rentreturn.dto.product.ProductDTO;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;

    @Override
    public Product create(Product product) {
        return productRepository.save(product);
    }

    @Override
    public Optional<Product> findById(Long id) {
        return productRepository.findById(id).filter(p -> !p.isDeleted());
    }

    @Override
    public List<Product> findAll() {
        return productRepository.findAllByDeletedFalse();
    }

    @Override
    public List<Product> findAvailable() {
        return productRepository.findAllByAvailableTrueAndDeletedFalse();
    }

    @Override
    public Product create(ProductDTO productDTO) {
        Product product = Product.builder()
                .name(productDTO.getName())
                .description(productDTO.getDescription())
                .pricePerDay(productDTO.getPricePerDay())
                .stock(productDTO.getStock())
                .category(productDTO.getCategory())
                .imageUrl(productDTO.getImageUrl())
                .available(productDTO.isAvailable())
                .createdBy(productDTO.getCreatedBy())
                .updatedBy(productDTO.getUpdatedBy())
                .deleted(false)
                .build();
        return create(product);
    }

    @Override
    public Product updateProduct(Long id, Product updatedProduct) {
        return productRepository.findById(id)
                .map(product -> {
                    product.setName(updatedProduct.getName());
                    product.setDescription(updatedProduct.getDescription());
                    product.setCategory(updatedProduct.getCategory());
                    product.setAvailable(updatedProduct.isAvailable());
                    product.setPricePerDay(updatedProduct.getPricePerDay());
                    product.setImageUrl(updatedProduct.getImageUrl());
                    product.setStock(updatedProduct.getStock());
                    product.setOwner(updatedProduct.getOwner());
                    product.setCreatedBy(updatedProduct.getCreatedBy());
                    product.setUpdatedBy(updatedProduct.getUpdatedBy());
                    return productRepository.save(product);
                })
                .orElseThrow(() -> new RuntimeException("Product not found"));
    }

    @Override
    public Product updateProduct(Long id, ProductDTO productDTO) {
        Product updatedProduct = Product.builder()
                .name(productDTO.getName())
                .description(productDTO.getDescription())
                .pricePerDay(productDTO.getPricePerDay())
                .stock(productDTO.getStock())
                .category(productDTO.getCategory())
                .imageUrl(productDTO.getImageUrl())
                .available(productDTO.isAvailable())
                .createdBy(productDTO.getCreatedBy())
                .updatedBy(productDTO.getUpdatedBy())
                .deleted(false)
                .build();
        return updateProduct(id, updatedProduct);
    }

    @Override
    public void softDeleteProduct(Long id) {
        productRepository.findById(id).ifPresent(product -> {
            product.setDeleted(true);
            product.setAvailable(false);
            productRepository.save(product);
        });
    }

    @Override
    public List<Product> findByCategory(String category) {
        return productRepository.findByCategoryIgnoreCaseAndDeletedFalse(category);
    }

    @Override
    public List<Product> searchByName(String keyword) {
        return productRepository.findByNameContainingIgnoreCaseAndDeletedFalse(keyword);
    }

    @Override
    public List<Product> findByOwner(Long ownerId) {
        return productRepository.findByOwnerIdAndDeletedFalse(ownerId);
    }

    @Override
    public List<Product> findAllByDeleted(boolean deleted) {
        return productRepository.findAllByDeleted(deleted);
    }

    @Override
    public long countAll() {
        return productRepository.countByDeletedFalse();
    }

    @Override
    public long countAvailable() {
        return productRepository.countByAvailableTrueAndDeletedFalse();
    }

    @Override
    public Product updateAvailability(Long id, boolean available) {
        Product product = findById(id).orElseThrow(() -> new RuntimeException("Product not found"));
        product.setAvailable(available);
        // Save the updated product (assuming you have a repository)
        return productRepository.save(product);
    }
}
