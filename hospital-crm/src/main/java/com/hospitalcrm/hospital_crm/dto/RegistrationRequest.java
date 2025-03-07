package com.hospitalcrm.hospital_crm.dto;

import lombok.Data;

@Data
public class RegistrationRequest {
    private String name;
    private String email;
    private String password;
    private String role;
    private String department;
} 