package com.hospitalcrm.hospital_crm.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.hospitalcrm.hospital_crm.repository.AppointmentRepository;
import com.hospitalcrm.hospital_crm.model.Appointment;
import com.hospitalcrm.hospital_crm.model.User;
import java.util.List;

@Service
public class DoctorService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    public List<Appointment> getDoctorAppointments(Long doctorId) {
        return appointmentRepository.findByDoctor_IdOrderByAppointmentDateDesc(doctorId);
    }

    public List<User> getDoctorPatients(Long doctorId) {
        return appointmentRepository.findDistinctPatientsByDoctorId(doctorId);
    }
} 