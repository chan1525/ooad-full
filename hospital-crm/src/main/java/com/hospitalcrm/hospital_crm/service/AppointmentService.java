package com.hospitalcrm.hospital_crm.service;

import com.hospitalcrm.hospital_crm.model.Appointment;
import com.hospitalcrm.hospital_crm.model.AppointmentStatus;
import com.hospitalcrm.hospital_crm.model.User;
import com.hospitalcrm.hospital_crm.repository.AppointmentRepository;
import com.hospitalcrm.hospital_crm.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Service
public class AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private UserRepository userRepository;

    public Appointment bookAppointment(Appointment appointment, Long patientId) {
        User patient = userRepository.findById(patientId)
            .orElseThrow(() -> new RuntimeException("Patient not found"));
        appointment.setPatient(patient);
        return appointmentRepository.save(appointment);
    }

    public List<Appointment> getPatientAppointments(Long patientId) {
        return appointmentRepository.findByPatientId(patientId);
    }

    public List<Appointment> getDoctorAppointments(Long doctorId) {
        return appointmentRepository.findByDoctorId(doctorId);
    }

    public void cancelAppointment(Appointment appointment) {
        appointment.setStatus(AppointmentStatus.CANCELLED);
        appointmentRepository.save(appointment);
    }

    public Appointment rescheduleAppointment(Long appointmentId, LocalDate newDate, LocalTime newTime) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
            .orElseThrow(() -> new RuntimeException("Appointment not found"));
        appointment.setAppointmentDate(newDate);
        appointment.setAppointmentTime(newTime);
        return appointmentRepository.save(appointment);
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
        for (Appointment appointment : appointments) {
            User patient = userRepository.findById(appointment.getPatientId()).orElse(null);
            User doctor = userRepository.findById(appointment.getDoctorId()).orElse(null);
            
            if (patient != null) {
                appointment.setPatientName(patient.getName());
            }
            if (doctor != null) {
                appointment.setDoctorName(doctor.getName());
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
}
