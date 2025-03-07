package com.hospitalcrm.hospital_crm.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.math.BigDecimal;

@Entity
@Table(name = "payments")
@Data
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "patient_id")
    private User patient;

    private BigDecimal amount;
    private LocalDate paymentDate;
    private String description;
    private String paymentStatus; // PAID, PENDING, FAILED
    private String paymentType;   // CONSULTATION, MEDICINE, LAB_TEST, etc.
} 