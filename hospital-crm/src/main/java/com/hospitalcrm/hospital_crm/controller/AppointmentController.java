package com.hospitalcrm.hospital_crm.controller;

import com.hospitalcrm.hospital_crm.model.Appointment;
import com.hospitalcrm.hospital_crm.model.User;
import com.hospitalcrm.hospital_crm.model.AppointmentStatus;
import com.hospitalcrm.hospital_crm.repository.AppointmentRepository;
import com.hospitalcrm.hospital_crm.repository.UserRepository;
import com.hospitalcrm.hospital_crm.dto.AppointmentRequest;
import com.hospitalcrm.hospital_crm.dto.StatusUpdateRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Map;
import java.util.Collections;
import org.springframework.http.HttpStatus;
import java.util.HashMap;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class AppointmentController {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/appointments")
    public ResponseEntity<?> getAllAppointments() {
        try {
            List<Appointment> appointments = appointmentRepository.findAll();
            return ResponseEntity.ok(appointments);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Collections.singletonMap("message", "Error fetching appointments: " + e.getMessage()));
        }
    }

    @PostMapping("/appointments")
    public ResponseEntity<?> createAppointment(@RequestBody AppointmentRequest request) {
        try {
            // Log the incoming request
            System.out.println("Received request: " + request);

            // Create appointment
            Appointment appointment = new Appointment();
            
            // Set all fields and log each step
            System.out.println("Setting patientId: " + request.getPatientId());
            appointment.setPatientId(request.getPatientId());
            
            System.out.println("Setting doctorId: " + request.getDoctorId());
            appointment.setDoctorId(request.getDoctorId());
            
            System.out.println("Setting department: " + request.getDepartment());
            appointment.setDepartment(request.getDepartment());
            
            System.out.println("Setting date: " + request.getAppointmentDate());
            appointment.setAppointmentDate(request.getAppointmentDate());
            
            System.out.println("Setting time: " + request.getAppointmentTime());
            appointment.setAppointmentTime(request.getAppointmentTime());
            
            System.out.println("Setting reason: " + request.getReason());
            appointment.setReason(request.getReason());
            
            // Set default status
            appointment.setStatus("SCHEDULED");

            // Log the appointment before saving
            System.out.println("Attempting to save: " + appointment);

            // Save and return
            Appointment savedAppointment = appointmentRepository.save(appointment);
            return ResponseEntity.ok(savedAppointment);
            
        } catch (Exception e) {
            // Log the full stack trace
            e.printStackTrace();
            
            // Return detailed error message
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", "Error creating appointment");
            errorResponse.put("details", e.getMessage());
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(errorResponse);
        }
    }

    @PutMapping("/appointments/{id}")
    public ResponseEntity<?> updateAppointment(@PathVariable Long id, @RequestBody Appointment appointment) {
        try {
            if (!appointmentRepository.existsById(id)) {
                return ResponseEntity.notFound()
                    .build();
            }
            appointment.setId(id);
            Appointment updatedAppointment = appointmentRepository.save(appointment);
            return ResponseEntity.ok(updatedAppointment);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Collections.singletonMap("message", "Error updating appointment: " + e.getMessage()));
        }
    }

    @DeleteMapping("/appointments/{id}")
    public ResponseEntity<?> deleteAppointment(@PathVariable Long id) {
        try {
            if (!appointmentRepository.existsById(id)) {
                return ResponseEntity.notFound()
                    .build();
            }
            appointmentRepository.deleteById(id);
            return ResponseEntity.ok()
                .body(Collections.singletonMap("message", "Appointment deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Collections.singletonMap("message", "Error deleting appointment: " + e.getMessage()));
        }
    }

    @GetMapping("/appointments/patient/{patientId}")
    public ResponseEntity<?> getPatientAppointments(@PathVariable Long patientId) {
        try {
            System.out.println("Fetching appointments for patient: " + patientId);
            List<Appointment> appointments = appointmentRepository.findByPatientId(patientId);
            System.out.println("Found appointments: " + appointments);
            return ResponseEntity.ok(appointments);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Collections.singletonMap("message", "Error fetching appointments: " + e.getMessage()));
        }
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<?> cancelAppointment(@PathVariable Long id) {
        try {
            Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
            
            appointment.setStatus(AppointmentStatus.CANCELLED);
            appointmentRepository.save(appointment);
            
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}/reschedule")
    public ResponseEntity<?> rescheduleAppointment(
        @PathVariable Long id,
        @RequestBody Map<String, String> request
    ) {
        try {
            Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
            
            appointment.setAppointmentDate(LocalDate.parse(request.get("newDate")));
            appointment.setAppointmentTime(LocalTime.parse(request.get("newTime")));
            appointment.setStatus(AppointmentStatus.UPCOMING);
            
            Appointment updatedAppointment = appointmentRepository.save(appointment);
            return ResponseEntity.ok(updatedAppointment);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<?> getDoctorAppointments(@PathVariable Long doctorId) {
        try {
            List<Appointment> appointments = appointmentRepository.findByDoctorId(doctorId);
            return ResponseEntity.ok(appointments);
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(Collections.singletonMap("message", "Error fetching appointments: " + e.getMessage()));
        }
    }

    @PutMapping("/{appointmentId}/status")
    public ResponseEntity<?> updateAppointmentStatus(
            @PathVariable Long appointmentId,
            @RequestBody StatusUpdateRequest statusRequest) {
        try {
            Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
            
            appointment.setStatus(AppointmentStatus.valueOf(statusRequest.getStatus()));
            appointmentRepository.save(appointment);
            
            return ResponseEntity.ok(appointment);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error updating status: " + e.getMessage());
        }
    }
}
