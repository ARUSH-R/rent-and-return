package com.rentreturn.backend.service;

import com.rentreturn.backend.dto.ProductCreateRequest;
import com.rentreturn.backend.dto.ProductDTO;
import java.util.List;

public interface ProductService {

    ProductDTO addProduct(ProductCreateRequest productRequest);

    List<ProductDTO> getAllProducts();

    ProductDTO getProductById(int id);

    ProductDTO updateProduct(int id, ProductCreateRequest updateRequest);

    void deleteProduct(int id);
}
