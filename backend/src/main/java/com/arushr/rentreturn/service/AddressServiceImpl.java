package com.arushr.rentreturn.service;

import com.arushr.rentreturn.dto.user.AddressDTO;
import com.arushr.rentreturn.dto.user.AddressResponseDTO;
import com.arushr.rentreturn.model.Address;
import com.arushr.rentreturn.model.User;
import com.arushr.rentreturn.repository.AddressRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class AddressServiceImpl implements AddressService {
    private final AddressRepository addressRepository;

    private AddressResponseDTO toResponseDTO(Address address) {
        AddressResponseDTO dto = new AddressResponseDTO();
        dto.setId(address.getId());
        dto.setName(address.getName());
        dto.setPhone(address.getPhone());
        dto.setAddressLine1(address.getAddressLine1());
        dto.setAddressLine2(address.getAddressLine2());
        dto.setCity(address.getCity());
        dto.setState(address.getState());
        dto.setPostalCode(address.getPostalCode());
        dto.setCountry(address.getCountry());
        dto.setDefault(address.isDefault());
        dto.setCreatedAt(address.getCreatedAt() != null ? address.getCreatedAt().toString() : null);
        dto.setUpdatedAt(address.getUpdatedAt() != null ? address.getUpdatedAt().toString() : null);
        return dto;
    }

    @Override
    public AddressResponseDTO createAddress(User user, AddressDTO dto) {
        if (dto.isDefault()) {
            // Unset previous default
            addressRepository.findByUserAndIsDefaultTrue(user)
                .ifPresent(addr -> { addr.setDefault(false); addressRepository.save(addr); });
        }
        Address address = Address.builder()
                .user(user)
                .name(dto.getName())
                .phone(dto.getPhone())
                .addressLine1(dto.getAddressLine1())
                .addressLine2(dto.getAddressLine2())
                .city(dto.getCity())
                .state(dto.getState())
                .postalCode(dto.getPostalCode())
                .country(dto.getCountry())
                .isDefault(dto.isDefault())
                .build();
        return toResponseDTO(addressRepository.save(address));
    }

    @Override
    public AddressResponseDTO updateAddress(User user, Long addressId, AddressDTO dto) {
        Address address = addressRepository.findByIdAndUser(addressId, user)
                .orElseThrow(() -> new RuntimeException("Address not found"));
        if (dto.isDefault() && !address.isDefault()) {
            // Unset previous default
            addressRepository.findByUserAndIsDefaultTrue(user)
                .ifPresent(addr -> { addr.setDefault(false); addressRepository.save(addr); });
        }
        address.setName(dto.getName());
        address.setPhone(dto.getPhone());
        address.setAddressLine1(dto.getAddressLine1());
        address.setAddressLine2(dto.getAddressLine2());
        address.setCity(dto.getCity());
        address.setState(dto.getState());
        address.setPostalCode(dto.getPostalCode());
        address.setCountry(dto.getCountry());
        address.setDefault(dto.isDefault());
        return toResponseDTO(addressRepository.save(address));
    }

    @Override
    public void deleteAddress(User user, Long addressId) {
        Address address = addressRepository.findByIdAndUser(addressId, user)
                .orElseThrow(() -> new RuntimeException("Address not found"));
        addressRepository.delete(address);
    }

    @Override
    public List<AddressResponseDTO> getUserAddresses(User user) {
        return addressRepository.findByUser(user)
                .stream().map(this::toResponseDTO).collect(Collectors.toList());
    }

    @Override
    public AddressResponseDTO setDefaultAddress(User user, Long addressId) {
        Address address = addressRepository.findByIdAndUser(addressId, user)
                .orElseThrow(() -> new RuntimeException("Address not found"));
        addressRepository.findByUserAndIsDefaultTrue(user)
                .ifPresent(addr -> { addr.setDefault(false); addressRepository.save(addr); });
        address.setDefault(true);
        return toResponseDTO(addressRepository.save(address));
    }

    @Override
    public AddressResponseDTO getAddress(User user, Long addressId) {
        Address address = addressRepository.findByIdAndUser(addressId, user)
                .orElseThrow(() -> new RuntimeException("Address not found"));
        return toResponseDTO(address);
    }
} 