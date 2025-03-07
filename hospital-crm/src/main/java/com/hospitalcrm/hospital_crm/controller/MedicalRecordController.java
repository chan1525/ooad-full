package com.hospitalcrm.hospital_crm.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.hospitalcrm.hospital_crm.model.MedicalRecord;
import com.hospitalcrm.hospital_crm.repository.MedicalRecordRepository;
import java.util.List;

@RestController
@RequestMapping("/api/medical-records")
@CrossOrigin(origins = "http://localhost:3000")
public class MedicalRecordController {

    @Autowired
    private MedicalRecordRepository medicalRecordRepository;

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<MedicalRecord>> getPatientRecords(@PathVariable Long patientId) {
        List<MedicalRecord> records = medicalRecordRepository.findByPatient_Id(patientId);
        return ResponseEntity.ok(records);
    }

    @PostMapping
    public ResponseEntity<MedicalRecord> addMedicalRecord(@RequestBody MedicalRecord record) {
        MedicalRecord savedRecord = medicalRecordRepository.save(record);
        return ResponseEntity.ok(savedRecord);
    }
}
