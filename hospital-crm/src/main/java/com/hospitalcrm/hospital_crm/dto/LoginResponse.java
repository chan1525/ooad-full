package com.hospitalcrm.hospital_crm.dto;

import lombok.Data;
import lombok.Builder;

@Data
@Builder
public class LoginResponse {
    private Long id;
    private String email;
    private String role;
}
