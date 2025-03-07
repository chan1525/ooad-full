package com.hospitalcrm.hospital_crm.dto;

public class DashboardStatsDTO {
    private long totalPatients;
    private long totalAppointments;
    private long totalDoctors;

    // Constructor
    public DashboardStatsDTO(long totalPatients, long totalAppointments, long totalDoctors) {
        this.totalPatients = totalPatients;
        this.totalAppointments = totalAppointments;
        this.totalDoctors = totalDoctors;
    }

    // Getters and setters
    public long getTotalPatients() {
        return totalPatients;
    }

    public void setTotalPatients(long totalPatients) {
        this.totalPatients = totalPatients;
    }

    public long getTotalAppointments() {
        return totalAppointments;
    }

    public void setTotalAppointments(long totalAppointments) {
        this.totalAppointments = totalAppointments;
    }

    public long getTotalDoctors() {
        return totalDoctors;
    }

    public void setTotalDoctors(long totalDoctors) {
        this.totalDoctors = totalDoctors;
    }
} 