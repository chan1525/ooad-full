package com.hospitalcrm.hospital_crm.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "appointments")
public class Appointment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "patient_id")
    private User patient;

    @ManyToOne
    @JoinColumn(name = "doctor_id")
    private User doctor;

    private String appointmentDate;
    private String appointmentTime;
    @Enumerated(EnumType.STRING)
    private AppointmentStatus status;
    private String department;
    private String reason;
    private String patientName;
    private String doctorName;

    // Getters
    public Long getId() {
        return id;
    }

    public User getPatient() {
        return patient;
    }

    public User getDoctor() {
        return doctor;
    }

    public String getAppointmentDate() {
        return appointmentDate;
    }

    public String getAppointmentTime() {
        return appointmentTime;
    }

    public AppointmentStatus getStatus() {
        return status;
    }

    public String getDepartment() {
        return department;
    }

    public Long getPatientId() {
        return patient != null ? patient.getId() : null;
    }

    public Long getDoctorId() {
        return doctor != null ? doctor.getId() : null;
    }

    public String getReason() {
        return reason;
    }

    // Setters
    public void setId(Long id) {
        this.id = id;
    }

    public void setPatient(User patient) {
        this.patient = patient;
    }

    public void setDoctor(User doctor) {
        this.doctor = doctor;
    }

    public void setAppointmentDate(String appointmentDate) {
        this.appointmentDate = appointmentDate;
    }

    public void setAppointmentTime(String appointmentTime) {
        this.appointmentTime = appointmentTime;
    }

    public void setStatus(AppointmentStatus status) {
        this.status = status;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public void setPatientName(String patientName) {
        this.patientName = patientName;
    }

    public void setDoctorName(String doctorName) {
        this.doctorName = doctorName;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }
}
