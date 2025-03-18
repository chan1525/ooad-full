package com.hospitalcrm.hospital_crm.service;

import com.hospitalcrm.hospital_crm.model.Payment;
import com.hospitalcrm.hospital_crm.model.Appointment;
import com.hospitalcrm.hospital_crm.repository.PaymentRepository;
import com.hospitalcrm.hospital_crm.repository.AppointmentRepository;
import com.hospitalcrm.hospital_crm.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class PaymentService {
    
    @Autowired
    private PaymentRepository paymentRepository;
    
    @Autowired
    private AppointmentRepository appointmentRepository;
    
    @Autowired
    private UserRepository userRepository;

    public List<Payment> getPatientPayments(Long patientId) {
        return paymentRepository.findByPatientIdOrderByPaymentDateDesc(patientId);
    }

    @Transactional
    public Payment processPayment(Payment payment) {
        payment.setPaymentDate(LocalDateTime.now());
        
        // Get the appointment and update its payment status
        Appointment appointment = appointmentRepository.findById(payment.getAppointmentId())
            .orElseThrow(() -> new RuntimeException("Appointment not found"));
        appointment.setPaid(true);
        appointmentRepository.save(appointment);
        
        return paymentRepository.save(payment);
    }

    public List<Appointment> getUnpaidAppointments(Long patientId) {
        return appointmentRepository.findByPatientIdAndPaidFalse(patientId);
    }
}
