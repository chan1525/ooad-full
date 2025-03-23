package com.hospitalcrm.hospital_crm.controller;

import com.hospitalcrm.hospital_crm.model.User;
import com.hospitalcrm.hospital_crm.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api/staff/doctors")
@CrossOrigin(origins = "http://localhost:3000")
public class StaffDoctorController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping
    public ResponseEntity<?> getAllDoctors() {
        try {
            List<User> doctors = userRepository.findByRole("DOCTOR");
            doctors.forEach(doctor -> doctor.setPassword(null)); // Remove passwords from response
            return ResponseEntity.ok(doctors);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Collections.singletonMap("message", "Error fetching doctors: " + e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<?> createDoctor(@RequestBody User doctor) {
        try {
            if (doctor.getEmail() == null || doctor.getName() == null) {
                return ResponseEntity.badRequest()
                    .body(Collections.singletonMap("message", "Name and email are required"));
            }

            if (userRepository.findByEmail(doctor.getEmail()).isPresent()) {
                return ResponseEntity.badRequest()
                    .body(Collections.singletonMap("message", "Email already registered"));
            }

            doctor.setRole("DOCTOR");
            doctor.setPassword(passwordEncoder.encode(doctor.getEmail())); // Set default password as email

            User savedDoctor = userRepository.save(doctor);
            savedDoctor.setPassword(null); // Remove password from response
            
            return ResponseEntity.ok(savedDoctor);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Collections.singletonMap("message", "Error creating doctor: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateDoctor(@PathVariable Long id, @RequestBody User doctor) {
        try {
            User existingDoctor = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

            existingDoctor.setName(doctor.getName());
            existingDoctor.setEmail(doctor.getEmail());
            existingDoctor.setPhone(doctor.getPhone());
            existingDoctor.setDepartment(doctor.getDepartment());

            User updatedDoctor = userRepository.save(existingDoctor);
            updatedDoctor.setPassword(null); // Remove password from response
            
            return ResponseEntity.ok(updatedDoctor);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Collections.singletonMap("message", "Error updating doctor: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDoctor(@PathVariable Long id) {
        try {
            if (!userRepository.existsById(id)) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Collections.singletonMap("message", "Doctor not found"));
            }
            userRepository.deleteById(id);
            return ResponseEntity.ok()
                .body(Collections.singletonMap("message", "Doctor deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Collections.singletonMap("message", "Error deleting doctor: " + e.getMessage()));
        }
    }
}
