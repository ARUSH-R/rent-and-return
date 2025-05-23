package com.rentreturn.backend.mapper;

import com.rentreturn.backend.dto.ProductCreateRequest;
import com.rentreturn.backend.dto.ProductDTO;
import com.rentreturn.backend.model.Product;
import org.springframework.stereotype.Component;

@Component
public class ProductMapper {

    public Product toProduct(ProductCreateRequest request) {
        Product product = new Product();
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setAvailable(true);  // default to available when creating
        return product;
    }

    public ProductDTO toProductDTO(Product product) {
        ProductDTO dto = new ProductDTO();
        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setDescription(product.getDescription());
        dto.setPrice(product.getPrice());
        dto.setAvailable(product.isAvailable());
        return dto;
    }
}
