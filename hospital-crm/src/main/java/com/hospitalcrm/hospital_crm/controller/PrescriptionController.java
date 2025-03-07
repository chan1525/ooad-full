package com.hospitalcrm.hospital_crm.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.hospitalcrm.hospital_crm.model.Prescription;
import com.hospitalcrm.hospital_crm.model.User;
import com.hospitalcrm.hospital_crm.repository.PrescriptionRepository;
import com.hospitalcrm.hospital_crm.repository.UserRepository;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/prescriptions")
@CrossOrigin(origins = "http://localhost:3000")
public class PrescriptionController {

    @Autowired
    private PrescriptionRepository prescriptionRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping
    public ResponseEntity<?> createPrescription(@RequestBody Prescription prescription) {
        try {
            prescription.setPrescriptionDate(LocalDateTime.now());
            Prescription savedPrescription = prescriptionRepository.save(prescription);
            return ResponseEntity.ok(savedPrescription);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Error creating prescription: " + e.getMessage());
        }
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<?> getPatientPrescriptions(@PathVariable Long patientId) {
        try {
            System.out.println("Fetching prescriptions for patient ID: " + patientId);
            List<Prescription> prescriptions = prescriptionRepository.findByPatientId(patientId);
            System.out.println("Found " + prescriptions.size() + " prescriptions");
            return ResponseEntity.ok(prescriptions);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Error fetching prescriptions: " + e.getMessage());
        }
    }

    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<?> getDoctorPrescriptions(@PathVariable Long doctorId) {
        try {
            List<Prescription> prescriptions = prescriptionRepository.findByDoctorId(doctorId);
            return ResponseEntity.ok(prescriptions);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Error fetching prescriptions: " + e.getMessage());
        }
    }
} 