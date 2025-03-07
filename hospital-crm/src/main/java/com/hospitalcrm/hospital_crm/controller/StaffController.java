package com.hospitalcrm.hospital_crm.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.hospitalcrm.hospital_crm.model.User;
import com.hospitalcrm.hospital_crm.repository.UserRepository;
import com.hospitalcrm.hospital_crm.repository.AppointmentRepository;
import com.hospitalcrm.hospital_crm.dto.DashboardStatsDTO;
import java.util.List;
import org.springframework.http.HttpStatus;
import java.util.Collections;

@RestController
@RequestMapping("/api/staff")
@CrossOrigin(origins = "http://localhost:3000")
public class StaffController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping("/dashboard-stats")
    public ResponseEntity<DashboardStatsDTO> getDashboardStats() {
        try {
            long totalPatients = userRepository.countByRole("PATIENT");
            long totalDoctors = userRepository.countByRole("DOCTOR");
            long totalAppointments = appointmentRepository.count();

            DashboardStatsDTO stats = new DashboardStatsDTO(
                totalPatients,
                totalAppointments,
                totalDoctors
            );

            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/patients")
    public ResponseEntity<?> getAllPatients() {
        try {
            List<User> patients = userRepository.findByRole("PATIENT");
            // Remove passwords from response
            patients.forEach(patient -> patient.setPassword(null));
            return ResponseEntity.ok(patients);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error fetching patients: " + e.getMessage());
        }
    }

    @PostMapping("/patients")
    public ResponseEntity<?> createPatient(@RequestBody User patient) {
        try {
            // Validate required fields
            if (patient.getEmail() == null || patient.getName() == null) {
                return ResponseEntity.badRequest()
                    .body(Collections.singletonMap("message", "Name and email are required"));
            }

            // Check if email already exists
            if (userRepository.findByEmail(patient.getEmail()).isPresent()) {
                return ResponseEntity.badRequest()
                    .body(Collections.singletonMap("message", "Email already registered"));
            }

            // Set role and default password
            patient.setRole("PATIENT");
            patient.setPassword(passwordEncoder.encode(patient.getEmail()));

            User savedPatient = userRepository.save(patient);
            savedPatient.setPassword(null); // Remove password from response
            
            return ResponseEntity.ok(savedPatient);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Collections.singletonMap("message", "Error creating patient: " + e.getMessage()));
        }
    }

    @PutMapping("/patients/{id}")
    public ResponseEntity<?> updatePatient(@PathVariable Long id, @RequestBody User patient) {
        try {
            User existingPatient = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

            existingPatient.setName(patient.getName());
            existingPatient.setEmail(patient.getEmail());
            existingPatient.setPhone(patient.getPhone());
            existingPatient.setAddress(patient.getAddress());
            existingPatient.setDateOfBirth(patient.getDateOfBirth());
            existingPatient.setGender(patient.getGender());

            User updatedPatient = userRepository.save(existingPatient);
            updatedPatient.setPassword(null); // Remove password from response
            
            return ResponseEntity.ok(updatedPatient);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error updating patient: " + e.getMessage());
        }
    }

    @DeleteMapping("/patients/{id}")
    public ResponseEntity<?> deletePatient(@PathVariable Long id) {
        try {
            if (!userRepository.existsById(id)) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Collections.singletonMap("message", "Patient not found"));
            }
            userRepository.deleteById(id);
            return ResponseEntity.ok()
                .body(Collections.singletonMap("message", "Patient deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Collections.singletonMap("message", "Error deleting patient: " + e.getMessage()));
        }
    }
} 