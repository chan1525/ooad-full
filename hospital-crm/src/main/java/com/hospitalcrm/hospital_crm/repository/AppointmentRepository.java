package com.hospitalcrm.hospital_crm.repository;

import com.hospitalcrm.hospital_crm.model.Appointment;
import com.hospitalcrm.hospital_crm.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByPatient_Id(Long patientId);
    List<Appointment> findByDoctor_Id(Long doctorId);
    List<Appointment> findByDoctor_IdOrderByAppointmentDateDesc(Long doctorId);
    
    @Query("SELECT DISTINCT a.patient FROM Appointment a WHERE a.doctor.id = :doctorId")
    List<User> findDistinctPatientsByDoctorId(Long doctorId);
}