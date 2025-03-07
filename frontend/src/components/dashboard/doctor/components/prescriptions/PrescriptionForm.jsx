import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Alert
} from '@mui/material';

const PrescriptionForm = ({ patientId, onPrescriptionCreated }) => {
  const [formData, setFormData] = useState({
    medication: '',
    dosage: '',
    instructions: '',
    notes: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // Validate required fields
    if (!formData.medication || !formData.dosage || !formData.instructions) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      const doctorId = localStorage.getItem('userId');
      
      // Log the IDs to verify they exist
      console.log('Patient ID:', patientId);
      console.log('Doctor ID:', doctorId);

      const prescriptionData = {
        patient: {
          id: parseInt(patientId)
        },
        doctor: {
          id: parseInt(doctorId)
        },
        medication: formData.medication,
        dosage: formData.dosage,
        instructions: formData.instructions,
        notes: formData.notes,
        prescriptionDate: new Date().toISOString()
      };

      // Log the request data
      console.log('Sending prescription data:', prescriptionData);

      const response = await fetch('http://localhost:8080/api/prescriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(prescriptionData)
      });

      // Log the raw response
      console.log('Response status:', response.status);
      const responseText = await response.text();
      console.log('Response text:', responseText);

      if (!response.ok) {
        throw new Error(responseText || 'Failed to create prescription');
      }

      // Only try to parse JSON if there's content
      let data;
      if (responseText) {
        try {
          data = JSON.parse(responseText);
          console.log('Parsed response data:', data);
        } catch (e) {
          console.log('Response was not JSON:', responseText);
        }
      }

      setSuccess(true);
      setFormData({
        medication: '',
        dosage: '',
        instructions: '',
        notes: ''
      });
      
      if (onPrescriptionCreated) {
        onPrescriptionCreated();
      }
    } catch (error) {
      console.error('Full error details:', error);
      setError(error.message || 'Error creating prescription');
    }
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Write Prescription
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Prescription created successfully!
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <TextField
          fullWidth
          required
          label="Medication"
          name="medication"
          value={formData.medication}
          onChange={(e) => setFormData({...formData, medication: e.target.value})}
          margin="normal"
          error={!formData.medication && error}
          helperText={!formData.medication && error ? 'Medication is required' : ''}
        />

        <TextField
          fullWidth
          required
          label="Dosage"
          name="dosage"
          value={formData.dosage}
          onChange={(e) => setFormData({...formData, dosage: e.target.value})}
          margin="normal"
          error={!formData.dosage && error}
          helperText={!formData.dosage && error ? 'Dosage is required' : ''}
        />

        <TextField
          fullWidth
          required
          multiline
          rows={3}
          label="Instructions"
          name="instructions"
          value={formData.instructions}
          onChange={(e) => setFormData({...formData, instructions: e.target.value})}
          margin="normal"
          error={!formData.instructions && error}
          helperText={!formData.instructions && error ? 'Instructions are required' : ''}
        />

        <TextField
          fullWidth
          multiline
          rows={3}
          label="Additional Notes"
          name="notes"
          value={formData.notes}
          onChange={(e) => setFormData({...formData, notes: e.target.value})}
          margin="normal"
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
        >
          Create Prescription
        </Button>
      </Box>
    </Paper>
  );
};

export default PrescriptionForm; 