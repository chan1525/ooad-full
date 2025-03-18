package com.hospitalcrm.hospital_crm.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.hospitalcrm.hospital_crm.model.Payment;
import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByPatientIdOrderByPaymentDateDesc(Long patientId);
    Payment findByAppointmentId(Long appointmentId);
} 