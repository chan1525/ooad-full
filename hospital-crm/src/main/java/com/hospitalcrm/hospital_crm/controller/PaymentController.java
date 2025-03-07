package com.hospitalcrm.hospital_crm.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.hospitalcrm.hospital_crm.model.Payment;
import com.hospitalcrm.hospital_crm.repository.PaymentRepository;
import java.util.List;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "http://localhost:3000")
public class PaymentController {

    @Autowired
    private PaymentRepository paymentRepository;

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<Payment>> getPatientPayments(@PathVariable Long patientId) {
        List<Payment> payments = paymentRepository.findByPatient_IdOrderByPaymentDateDesc(patientId);
        return ResponseEntity.ok(payments);
    }
} 