package com.hospitalcrm.hospital_crm.service;

import com.hospitalcrm.hospital_crm.dto.RegisterRequest;
import com.hospitalcrm.hospital_crm.dto.LoginRequest;
import com.hospitalcrm.hospital_crm.dto.LoginResponse;
import com.hospitalcrm.hospital_crm.model.User;
import com.hospitalcrm.hospital_crm.model.UserRole;
import com.hospitalcrm.hospital_crm.repository.UserRepository;
import com.hospitalcrm.hospital_crm.exception.UserAlreadyExistsException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.Map;
import java.util.HashMap;
import com.hospitalcrm.hospital_crm.exception.ResourceNotFoundException;

@Service
public class UserService {

    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public Map<String, Object> registerUser(User user) {
        // Check if user already exists
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }

        // Encode password
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        // Save user
        User savedUser = userRepository.save(user);

        // Create response
        Map<String, Object> response = new HashMap<>();
        response.put("userId", savedUser.getId());
        response.put("email", savedUser.getEmail());
        response.put("role", savedUser.getRole());
        response.put("message", "Registration successful");

        return response;
    }

    public LoginResponse login(LoginRequest loginRequest) {
        User user = userRepository.findByEmail(loginRequest.getEmail())
            .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        // For now, return a simple token. In production, use proper JWT
        String token = "dummy-token-" + System.currentTimeMillis();

        return LoginResponse.builder()
            .token(token)
            .userId(user.getId())
            .role(user.getRole().toString())
            .email(user.getEmail())
            .build();
    }

    public Map<String, Object> authenticateUser(String email, String password) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        Map<String, Object> response = new HashMap<>();
        response.put("userId", user.getId());
        response.put("email", user.getEmail());
        response.put("role", user.getRole());

        return response;
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
    }
}
