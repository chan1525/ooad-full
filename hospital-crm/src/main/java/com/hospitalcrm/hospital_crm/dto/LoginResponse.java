package com.hospitalcrm.hospital_crm.dto;

import lombok.Data;
import lombok.Builder;

@Data
@Builder
public class LoginResponse {
    private String message;
    private String token;
    private String role;
    private Long userId;
    private String email;

    // Default constructor
    public LoginResponse() {}

    // All args constructor
    public LoginResponse(String message, String token, String role, Long userId) {
        this.message = message;
        this.token = token;
        this.role = role;
        this.userId = userId;
    }

    // Builder class
    public static class LoginResponseBuilder {
        private String message;
        private String token;
        private String role;
        private Long userId;
        private String email;

        public LoginResponseBuilder email(String email) {
            this.email = email;
            return this;
        }

        // Other builder methods
        public LoginResponseBuilder message(String message) {
            this.message = message;
            return this;
        }

        public LoginResponseBuilder token(String token) {
            this.token = token;
            return this;
        }

        public LoginResponseBuilder role(String role) {
            this.role = role;
            return this;
        }

        public LoginResponseBuilder userId(Long userId) {
            this.userId = userId;
            return this;
        }

        public LoginResponse build() {
            LoginResponse response = new LoginResponse();
            response.message = this.message;
            response.token = this.token;
            response.role = this.role;
            response.userId = this.userId;
            response.email = this.email;
            return response;
        }
    }

    public static LoginResponseBuilder builder() {
        return new LoginResponseBuilder();
    }

    // Getters and setters
}
