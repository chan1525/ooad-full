package com.hospitalcrm.hospital_crm.controller;

import com.hospitalcrm.hospital_crm.model.Payment;
import com.hospitalcrm.hospital_crm.model.Appointment;
import com.hospitalcrm.hospital_crm.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "http://localhost:3000")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<Payment>> getPatientPayments(@PathVariable Long patientId) {
        List<Payment> payments = paymentService.getPatientPayments(patientId);
        return ResponseEntity.ok(payments);
    }

    @PostMapping
    public ResponseEntity<Payment> createPayment(@RequestBody Payment payment) {
        Payment savedPayment = paymentService.processPayment(payment);
        return ResponseEntity.ok(savedPayment);
    }

    @GetMapping("/appointments/unpaid/{patientId}")
    public ResponseEntity<List<Appointment>> getUnpaidAppointments(@PathVariable Long patientId) {
        List<Appointment> unpaidAppointments = paymentService.getUnpaidAppointments(patientId);
        return ResponseEntity.ok(unpaidAppointments);
    }
} 