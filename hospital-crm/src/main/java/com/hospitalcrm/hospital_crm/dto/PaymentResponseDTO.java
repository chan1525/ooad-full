package com.hospitalcrm.hospital_crm.dto;

import com.hospitalcrm.hospital_crm.model.Payment;
import java.time.LocalDateTime;

public class PaymentResponseDTO {
    private Long id;
    private Long patientId;
    private String patientName;
    private Double amount;
    private LocalDateTime paymentDate;
    private String description;
    private String paymentStatus;
    private String paymentType;
    private String paymentMethod;
    private String status;
    private Long appointmentId;
    private String appointmentDate;
    private String appointmentTime;

    // Constructor to convert Payment to DTO
    public PaymentResponseDTO(Payment payment) {
        this.id = payment.getId();
        this.patientId = payment.getPatientId();
        this.amount = payment.getAmount();
        this.paymentDate = payment.getPaymentDate();
        this.description = payment.getDescription();
        this.paymentStatus = payment.getPaymentStatus();
        this.paymentType = payment.getPaymentType();
        this.paymentMethod = payment.getPaymentMethod() != null ? payment.getPaymentMethod().name() : null;
        this.status = payment.getStatus() != null ? payment.getStatus().name() : null;
        this.appointmentId = payment.getAppointmentId();
    }

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getPatientId() { return patientId; }
    public void setPatientId(Long patientId) { this.patientId = patientId; }

    public String getPatientName() { return patientName; }
    public void setPatientName(String patientName) { this.patientName = patientName; }

    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }

    public LocalDateTime getPaymentDate() { return paymentDate; }
    public void setPaymentDate(LocalDateTime paymentDate) { this.paymentDate = paymentDate; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(String paymentStatus) { this.paymentStatus = paymentStatus; }

    public String getPaymentType() { return paymentType; }
    public void setPaymentType(String paymentType) { this.paymentType = paymentType; }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Long getAppointmentId() { return appointmentId; }
    public void setAppointmentId(Long appointmentId) { this.appointmentId = appointmentId; }

    public String getAppointmentDate() { return appointmentDate; }
    public void setAppointmentDate(String appointmentDate) { this.appointmentDate = appointmentDate; }

    public String getAppointmentTime() { return appointmentTime; }
    public void setAppointmentTime(String appointmentTime) { this.appointmentTime = appointmentTime; }
}
