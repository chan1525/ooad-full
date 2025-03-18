package com.hospitalcrm.hospital_crm.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
@Data
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "patient_id", nullable = false)
    private Long patientId;

    private Double amount;

    @Column(name = "payment_date")
    private LocalDateTime paymentDate;

    private String description;

    @Column(name = "payment_status")
    private String paymentStatus;

    @Column(name = "payment_type")
    private String paymentType;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_method")
    private PaymentMethod paymentMethod;

    @Enumerated(EnumType.STRING)
    private PaymentStatus status;

    @Column(name = "appointment_id")
    private Long appointmentId;

    // Payment method enum
    public enum PaymentMethod {
        CASH, CARD, UPI
    }

    // Payment status enum
    public enum PaymentStatus {
        PENDING, COMPLETED, FAILED
    }
} 