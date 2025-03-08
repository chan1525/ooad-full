package com.hospitalcrm.hospital_crm.dto;

public class RescheduleRequest {
    private String newDate;
    private String newTime;

    // Default constructor
    public RescheduleRequest() {}

    // Getters and Setters
    public String getNewDate() {
        return newDate;
    }

    public void setNewDate(String newDate) {
        this.newDate = newDate;
    }

    public String getNewTime() {
        return newTime;
    }

    public void setNewTime(String newTime) {
        this.newTime = newTime;
    }
}
