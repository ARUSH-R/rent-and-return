package com.arushr.rentreturn.service;

import com.arushr.rentreturn.enums.RentalStatus;
import com.arushr.rentreturn.repository.ProductRepository;
import com.arushr.rentreturn.repository.RentalRepository;
import com.arushr.rentreturn.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AdminStatsService {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final RentalRepository rentalRepository;

    public Map<String, Long> countUsers() {
        Map<String, Long> map = new HashMap<>();
        map.put("count", userRepository.count());
        return map;
    }

    public Map<String, Long> countProducts() {
        Map<String, Long> map = new HashMap<>();
        map.put("count", productRepository.count());
        return map;
    }

    public Map<String, Long> countActiveRentals() {
        Map<String, Long> map = new HashMap<>();
        map.put("count", rentalRepository.countByRentalStatus(RentalStatus.ACTIVE));
        return map;
    }

    public Map<String, Double> getTotalRevenue() {
        Map<String, Double> map = new HashMap<>();
        Double total = rentalRepository.sumTotalRevenue();
        map.put("total", total != null ? total : 0.0);
        return map;
    }
}
