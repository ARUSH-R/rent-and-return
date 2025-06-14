package com.rentreturn.backend.repository;

import com.rentreturn.backend.model.Token;
import com.rentreturn.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TokenRepository extends JpaRepository<Token, Long> {

    List<Token> findAllByUser(User user);

    List<Token> findAllByUserAndRevokedFalseAndExpiredFalse(User user);

    Optional<Token> findByToken(String token);

    List<Token> findAllValidTokensByUser(Long id);
}
