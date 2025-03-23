package com.hospitalcrm.hospital_crm.controller;

import com.hospitalcrm.hospital_crm.model.Payment;
import com.hospitalcrm.hospital_crm.service.PaymentService;
import com.hospitalcrm.hospital_crm.repository.UserRepository;
import com.hospitalcrm.hospital_crm.repository.AppointmentRepository;
import com.hospitalcrm.hospital_crm.dto.PaymentResponseDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/staff/payments")
@CrossOrigin(origins = "http://localhost:3000")
public class StaffPaymentController {

    @Autowired
    private PaymentService paymentService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @GetMapping
    public ResponseEntity<?> getAllPayments() {
        try {
            List<Payment> payments = paymentService.getAllPayments();
            List<PaymentResponseDTO> response = payments.stream()
                .map(payment -> {
                    PaymentResponseDTO dto = new PaymentResponseDTO(payment);
                    userRepository.findById(payment.getPatientId())
                        .ifPresent(patient -> dto.setPatientName(patient.getName()));
                    if (payment.getAppointmentId() != null) {
                        appointmentRepository.findById(payment.getAppointmentId())
                            .ifPresent(appointment -> {
                                dto.setAppointmentDate(appointment.getAppointmentDate());
                                dto.setAppointmentTime(appointment.getAppointmentTime());
                            });
                    }
                    return dto;
                })
                .collect(Collectors.toList());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(Map.of("message", "Error fetching payments: " + e.getMessage()));
        }
    }

    @GetMapping("/pending-count")
    public ResponseEntity<?> getPendingPaymentsCount() {
        try {
            long count = paymentService.getPendingPaymentsCount();
            return ResponseEntity.ok(Map.of("count", count));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(Map.of("message", "Error fetching pending payments count: " + e.getMessage()));
        }
    }
}
