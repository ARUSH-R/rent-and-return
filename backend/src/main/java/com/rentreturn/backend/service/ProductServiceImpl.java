package com.rentreturn.backend.service;

import com.rentreturn.backend.dto.ProductCreateRequest;
import com.rentreturn.backend.dto.ProductDTO;
import com.rentreturn.backend.exception.ProductNotFoundException;
import com.rentreturn.backend.mapper.ProductMapper;
import com.rentreturn.backend.model.Product;
import com.rentreturn.backend.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductServiceImpl implements ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ProductMapper productMapper;

    @Override
    public ProductDTO addProduct(ProductCreateRequest productRequest) {
        Product product = productMapper.toProduct(productRequest);
        Product savedProduct = productRepository.save(product);
        return productMapper.toProductDTO(savedProduct);
    }

    @Override
    public List<ProductDTO> getAllProducts() {
        List<Product> products = productRepository.findAll();
        return products.stream()
                .map(productMapper::toProductDTO)
                .toList();
    }

    @Override
    public ProductDTO getProductById(int id) {
        Product product = productRepository.findById(id).orElse(null);
        return product == null ? null : productMapper.toProductDTO(product);
    }

    @Override
    public ProductDTO updateProduct(int id, ProductCreateRequest updateRequest) {
        Product existingProduct = productRepository.findById(id).orElse(null);
        if (existingProduct == null) return null;

        existingProduct.setName(updateRequest.getName());
        existingProduct.setDescription(updateRequest.getDescription());
        existingProduct.setPrice(updateRequest.getPrice());
        existingProduct.setAvailable(updateRequest.isAvailable()); // if your request has availability

        Product savedProduct = productRepository.save(existingProduct);
        return productMapper.toProductDTO(savedProduct);
    }

    @Override
    public void deleteProduct(int id) {
        productRepository.deleteById(id);
    }
}
