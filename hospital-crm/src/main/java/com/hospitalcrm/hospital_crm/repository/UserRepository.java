package com.hospitalcrm.hospital_crm.repository;

import com.hospitalcrm.hospital_crm.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    List<User> findByRole(String role);
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    long countByRole(String role);
}
