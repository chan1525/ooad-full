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
import com.hospitalcrm.hospital_crm.service.AppointmentService;
import com.hospitalcrm.hospital_crm.dto.RescheduleRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.Optional;
import com.hospitalcrm.hospital_crm.exception.ResourceNotFoundException;
import com.hospitalcrm.hospital_crm.service.UserService;

@RestController
@RequestMapping("/api/appointments")
@CrossOrigin(origins = "http://localhost:3000")
public class AppointmentController {

    private static final Logger logger = LoggerFactory.getLogger(AppointmentController.class);

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AppointmentService appointmentService;

    @Autowired
    private UserService userService;

    @GetMapping
    public ResponseEntity<?> getAllAppointments() {
        try {
            List<Appointment> appointments = appointmentRepository.findAll();
            return ResponseEntity.ok(appointments);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Collections.singletonMap("message", "Error fetching appointments: " + e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<Appointment> createAppointment(@RequestBody Appointment appointment,
                                                       @RequestParam Long patientId,
                                                       @RequestParam Long doctorId) {
        Appointment savedAppointment = appointmentService.createAppointment(appointment, patientId, doctorId);
        return ResponseEntity.ok(savedAppointment);
    }

    @PutMapping("/{id}")
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

    @DeleteMapping("/{id}")
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

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<?> getPatientAppointments(@PathVariable Long patientId) {
        try {
            System.out.println("Fetching appointments for patient: " + patientId);
            List<Appointment> appointments = appointmentRepository.findByPatientId(patientId);
            System.out.println("Found appointments: " + appointments);
            return ResponseEntity.ok(appointments);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error fetching appointments");
        }
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<?> cancelAppointment(@PathVariable Long id) {
        try {
            appointmentService.cancelAppointment(id);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Appointment cancelled successfully");
            response.put("status", "success");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", "Error cancelling appointment: " + e.getMessage());
            errorResponse.put("status", "error");
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }

    @PutMapping("/{id}/reschedule")
    public ResponseEntity<?> rescheduleAppointment(@PathVariable Long id, @RequestBody RescheduleRequest request) {
        try {
            Appointment updatedAppointment = appointmentService.rescheduleAppointment(id, 
                request.getNewDate(), request.getNewTime());
            return ResponseEntity.ok(updatedAppointment);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error rescheduling appointment: " + e.getMessage());
        }
    }

    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<?> getDoctorAppointments(@PathVariable Long doctorId) {
        try {
            List<Appointment> appointments = appointmentRepository.findByDoctorId(doctorId);
            return ResponseEntity.ok(appointments);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error fetching appointments");
        }
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Appointment> updateAppointmentStatus(@PathVariable Long id,
                                                             @RequestParam AppointmentStatus status) {
        Appointment updatedAppointment = appointmentService.updateAppointmentStatus(id, status);
        return ResponseEntity.ok(updatedAppointment);
    }

    @GetMapping("/unpaid/{patientId}")
    public ResponseEntity<?> getUnpaidAppointments(@PathVariable Long patientId) {
        try {
            List<Appointment> unpaidAppointments = appointmentRepository.findByPatientIdAndPaidFalse(patientId);
            return ResponseEntity.ok(unpaidAppointments);
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body("Error fetching unpaid appointments: " + e.getMessage());
        }
    }
}
