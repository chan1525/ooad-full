package com.hospitalcrm.hospital_crm.service;

import com.hospitalcrm.hospital_crm.model.Appointment;
import com.hospitalcrm.hospital_crm.model.AppointmentStatus;
import com.hospitalcrm.hospital_crm.model.User;
import com.hospitalcrm.hospital_crm.repository.AppointmentRepository;
import com.hospitalcrm.hospital_crm.repository.UserRepository;
import com.hospitalcrm.hospital_crm.exception.ResourceNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Service
public class AppointmentService {

    private static final Logger logger = LoggerFactory.getLogger(AppointmentService.class);

    private final AppointmentRepository appointmentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserService userService;

    @Autowired
    public AppointmentService(AppointmentRepository appointmentRepository) {
        this.appointmentRepository = appointmentRepository;
    }

    public Appointment bookAppointment(Appointment appointment, Long patientId) {
        User patient = userRepository.findById(patientId)
            .orElseThrow(() -> new RuntimeException("Patient not found"));
        appointment.setPatientId(patientId);
        appointment.setPatientName(patient.getName());
        return appointmentRepository.save(appointment);
    }

    public List<Appointment> getPatientAppointments(Long patientId) {
        return appointmentRepository.findByPatientId(patientId);
    }

    public List<Appointment> getDoctorAppointments(Long doctorId) {
        List<Appointment> appointments = appointmentRepository.findByDoctorId(doctorId);
        
        // Enhance appointments with patient email
        for (Appointment appointment : appointments) {
            User patient = userRepository.findById(appointment.getPatientId())
                .orElse(null);
            if (patient != null) {
                appointment.setPatientEmail(patient.getEmail()); // We'll add this field
            }
        }
        
        return appointments;
    }

    public void cancelAppointment(Long id) {
        Appointment appointment = appointmentRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Appointment not found with id: " + id));
        
        appointment.setStatus(Appointment.Status.CANCELLED);
        appointmentRepository.save(appointment);
    }

    public Appointment rescheduleAppointment(Long id, String newDate, String newTime) {
        Optional<Appointment> appointmentOpt = appointmentRepository.findById(id);
        if (appointmentOpt.isPresent()) {
            Appointment appointment = appointmentOpt.get();
            appointment.setAppointmentDate(newDate);
            appointment.setAppointmentTime(newTime);
            return appointmentRepository.save(appointment);
        }
        throw new ResourceNotFoundException("Appointment not found with id: " + id);
    }

    public List<Appointment> getAppointmentsWithDetails(Long doctorId) {
        List<Appointment> appointments = appointmentRepository.findByDoctorId(doctorId);
        for (Appointment appointment : appointments) {
            User patient = userRepository.findById(appointment.getPatientId()).orElse(null);
            if (patient != null) {
                appointment.setPatientName(patient.getName());
            }
        }
        return appointments;
    }

    public List<Appointment> getAllAppointments() {
        List<Appointment> appointments = appointmentRepository.findAll();
        
        // Enhance appointments with patient and doctor names
        for (Appointment appointment : appointments) {
            try {
                // Only try to fetch names if IDs are not null
                if (appointment.getPatientId() != null) {
                    userRepository.findById(appointment.getPatientId())
                        .ifPresent(patient -> appointment.setPatientName(patient.getName()));
                }
                
                if (appointment.getDoctorId() != null) {
                    userRepository.findById(appointment.getDoctorId())
                        .ifPresent(doctor -> appointment.setDoctorName(doctor.getName()));
                }
            } catch (Exception e) {
                logger.error("Error enhancing appointment data: " + e.getMessage());
                // Continue with next appointment instead of failing
            }
        }
        
        return appointments;
    }

    public Optional<Appointment> updateAppointment(Long id, Appointment appointment) {
        return appointmentRepository.findById(id)
            .map(existingAppointment -> {
                existingAppointment.setStatus(appointment.getStatus());
                existingAppointment.setAppointmentDate(appointment.getAppointmentDate());
                existingAppointment.setAppointmentTime(appointment.getAppointmentTime());
                existingAppointment.setReason(appointment.getReason());
                return appointmentRepository.save(existingAppointment);
            });
    }

    public void deleteAppointment(Long id) {
        appointmentRepository.deleteById(id);
    }

    public Optional<Appointment> getAppointmentById(Long id) {
        return appointmentRepository.findById(id);
    }

    public Appointment updateAppointment(Appointment appointment) {
        return appointmentRepository.save(appointment);
    }

    public Appointment createAppointment(Appointment appointment, Long patientId, Long doctorId) {
        User patient = userRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found"));
        User doctor = userRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        appointment.setPatientId(patientId);
        appointment.setDoctorId(doctorId);
        appointment.setPatientName(patient.getName());
        appointment.setDoctorName(doctor.getName());
        appointment.setStatus(Appointment.Status.SCHEDULED);
        
        return appointmentRepository.save(appointment);
    }

    public Appointment updateAppointmentStatus(Long id, AppointmentStatus newStatus) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
        
        appointment.setStatus(Appointment.Status.valueOf(newStatus.name()));
        return appointmentRepository.save(appointment);
    }

    public void updateAppointmentNames(Appointment appointment) {
        User patient = userService.getUserById(appointment.getPatientId());
        User doctor = userService.getUserById(appointment.getDoctorId());
        
        appointment.setPatientName(patient.getName());
        appointment.setDoctorName(doctor.getName());
    }
}
