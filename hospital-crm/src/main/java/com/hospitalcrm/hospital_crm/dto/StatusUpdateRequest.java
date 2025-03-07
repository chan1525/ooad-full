package com.hospitalcrm.hospital_crm.dto;

import lombok.Data;

@Data
public class StatusUpdateRequest {
    private String status;

    // Default constructor
    public StatusUpdateRequest() {}

    // Constructor with status
    public StatusUpdateRequest(String status) {
        this.status = status;
    }

    // Getter and setter
    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
} 