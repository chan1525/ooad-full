package com.hospitalcrm.hospital_crm.dto;

import lombok.Data;

@Data
public class LoginRequest {
    private String email;
    private String password;
}
