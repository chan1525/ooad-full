package com.hospitalcrm.hospital_crm.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import com.hospitalcrm.hospital_crm.model.Appointment;
import com.hospitalcrm.hospital_crm.model.User;
import com.hospitalcrm.hospital_crm.repository.UserRepository;
import com.hospitalcrm.hospital_crm.service.DoctorService;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class DoctorController {

    @Autowired
    private DoctorService doctorService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/doctors")
    public ResponseEntity<List<User>> getAllDoctors() {
        try {
            List<User> doctors = userRepository.findByRole("DOCTOR");
            // For debugging
            System.out.println("Found doctors: " + doctors.size());
            
            // Remove sensitive information
            doctors.forEach(doctor -> {
                doctor.setPassword(null);
                // For debugging
                System.out.println("Doctor: " + doctor.getName() + ", Department: " + doctor.getDepartment());
            });
            
            return ResponseEntity.ok(doctors);
        } catch (Exception e) {
            // For debugging
            System.err.println("Error fetching doctors: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/doctor/{doctorId}/appointments")
    public ResponseEntity<List<Appointment>> getDoctorAppointments(@PathVariable Long doctorId) {
        return ResponseEntity.ok(doctorService.getDoctorAppointments(doctorId));
    }

    @GetMapping("/doctor/{doctorId}/patients")
    public ResponseEntity<List<User>> getDoctorPatients(@PathVariable Long doctorId) {
        return ResponseEntity.ok(doctorService.getDoctorPatients(doctorId));
    }
} 