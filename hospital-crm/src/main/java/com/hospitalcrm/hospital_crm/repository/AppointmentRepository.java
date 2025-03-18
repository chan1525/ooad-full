package com.hospitalcrm.hospital_crm.repository;

import com.hospitalcrm.hospital_crm.model.Appointment;
import com.hospitalcrm.hospital_crm.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByPatientIdAndPaidFalse(Long patientId);
    List<Appointment> findByDoctorId(Long doctorId);
    List<Appointment> findByPatientId(Long patientId);
    
    @Query("SELECT DISTINCT u FROM User u JOIN Appointment a ON u.id = a.patientId WHERE a.doctorId = :doctorId")
    List<User> findDistinctPatientsByDoctorId(Long doctorId);
}