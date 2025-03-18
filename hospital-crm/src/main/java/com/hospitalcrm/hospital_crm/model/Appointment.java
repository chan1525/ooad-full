package com.hospitalcrm.hospital_crm.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;
import lombok.Data;

@Entity
@Table(name = "appointments")
@Data
public class Appointment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "patient_id")
    private Long patientId;

    @Column(name = "doctor_id")
    private Long doctorId;

    private String department;
    
    @Column(name = "appointment_date")
    private String appointmentDate;
    
    @Column(name = "appointment_time")
    private String appointmentTime;
    
    private String reason;
    
    @Column(name = "doctor_name")
    private String doctorName;
    
    @Column(name = "patient_name")
    private String patientName;

    @Transient  // This means the field won't be stored in the database
    private String patientEmail;

    @Enumerated(EnumType.STRING)
    private Status status;

    private boolean paid = false;
    private Double amount = 500.0;

    public enum Status {
        SCHEDULED, COMPLETED, CANCELLED
    }
}
