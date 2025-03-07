package com.hospitalcrm.hospital_crm.dto;

import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class AppointmentRequest {
    private Long patientId;
    private Long doctorId;
    private String department;
    private String appointmentDate;
    private String appointmentTime;
    private String reason;
} 