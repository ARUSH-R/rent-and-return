package com.arushr.rentreturn.service;

import com.arushr.rentreturn.dto.user.AddressDTO;
import com.arushr.rentreturn.dto.user.AddressResponseDTO;
import com.arushr.rentreturn.model.User;

import java.util.List;

public interface AddressService {
    AddressResponseDTO createAddress(User user, AddressDTO dto);
    AddressResponseDTO updateAddress(User user, Long addressId, AddressDTO dto);
    void deleteAddress(User user, Long addressId);
    List<AddressResponseDTO> getUserAddresses(User user);
    AddressResponseDTO setDefaultAddress(User user, Long addressId);
    AddressResponseDTO getAddress(User user, Long addressId);
} 