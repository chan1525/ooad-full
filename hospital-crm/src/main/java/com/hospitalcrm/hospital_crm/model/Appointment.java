package com.hospitalcrm.hospital_crm.model;

import jakarta.persistence.*;
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
    
    @Column(name = "status")
    private String status;

    @Transient
    private String patientName;
    
    @Transient
    private String doctorName;
}
