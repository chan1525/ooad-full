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
    public ResponseEntity<?> createAppointment(@RequestBody AppointmentRequest request) {
        try {
            Appointment appointment = new Appointment();
            User patient = userService.getUserById(request.getPatientId());
            User doctor = userService.getUserById(request.getDoctorId());
            
            appointment.setPatient(patient);
            appointment.setDoctor(doctor);
            appointment.setDepartment(request.getDepartment());
            appointment.setAppointmentDate(request.getAppointmentDate());
            appointment.setAppointmentTime(request.getAppointmentTime());
            appointment.setStatus(AppointmentStatus.SCHEDULED);
            appointment.setPatientName(patient.getName());
            appointment.setDoctorName(doctor.getName());
            appointment.setReason(request.getReason());

            Appointment savedAppointment = appointmentService.createAppointment(appointment);
            return ResponseEntity.ok(savedAppointment);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error creating appointment");
        }
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
            List<Appointment> appointments = appointmentRepository.findByPatient_Id(patientId);
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
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error cancelling appointment: " + e.getMessage());
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
            List<Appointment> appointments = appointmentRepository.findByDoctor_Id(doctorId);
            return ResponseEntity.ok(appointments);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error fetching appointments");
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
