import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const AppointmentBooking = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Predefined list of departments
  const departments = [
    'Cardiology',
    'Dermatology',
    'Neurology',
    'Orthopedics',
    'Pediatrics',
    'General Medicine',
    'Gynecology'
  ];

  const [formData, setFormData] = useState({
    department: '',
    doctorId: '',
    appointmentDate: '',
    appointmentTime: '',
    reason: ''
  });

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      console.log('Fetching doctors...'); // Debug log
      const response = await fetch('http://localhost:8080/api/doctors', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Add any auth headers if needed
        }
      });
      
      console.log('Response status:', response.status); // Debug log
      
      if (response.ok) {
        const data = await response.json();
        console.log('Doctors data:', data); // Debug log
        setDoctors(data);
        setLoading(false);
        setError('');
      } else {
        const errorText = await response.text();
        console.error('Failed to fetch doctors:', errorText); // Debug log
        setError(`Failed to fetch doctors: ${response.status} ${errorText}`);
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching doctors:', error); // Debug log
      setError(`Error fetching doctors: ${error.message}`);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
        const patientId = localStorage.getItem('userId');
        
        // Log the form data before sending
        console.log('Form Data:', formData);
        
        const appointmentData = {
            patientId: parseInt(patientId),
            doctorId: parseInt(formData.doctorId),
            department: formData.department,
            appointmentDate: formData.appointmentDate,
            appointmentTime: formData.appointmentTime,
            reason: formData.reason
        };

        // Log the actual data being sent
        console.log('Sending Data:', appointmentData);

        const response = await fetch('http://localhost:8080/api/appointments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(appointmentData)
        });

        // Log the full response
        console.log('Response Status:', response.status);
        const responseText = await response.text();
        console.log('Response Text:', responseText);

        if (!response.ok) {
            let errorData;
            try {
                errorData = JSON.parse(responseText);
                console.error('Error Data:', errorData);
            } catch (e) {
                console.error('Raw Error:', responseText);
            }
            throw new Error(errorData?.message || 'Failed to book appointment');
        }

        navigate('/patient/dashboard/appointments');
    } catch (error) {
        console.error('Full Error:', error);
        setError(error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));

    // Reset doctor selection when department changes
    if (name === 'department') {
      setFormData(prevState => ({
        ...prevState,
        doctorId: ''
      }));
    }
  };

  // Filter doctors by selected department
  const availableDoctors = doctors.filter(
    doctor => !formData.department || doctor.department === formData.department
  );

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Book Appointment
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <FormControl fullWidth margin="normal">
            <InputLabel>Department</InputLabel>
            <Select
              name="department"
              value={formData.department}
              onChange={handleChange}
              required
            >
              {departments.map((dept) => (
                <MenuItem key={dept} value={dept}>
                  {dept}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel>Doctor</InputLabel>
            <Select
              name="doctorId"
              value={formData.doctorId}
              onChange={handleChange}
              required
              disabled={!formData.department}
            >
              {availableDoctors.map((doctor) => (
                <MenuItem key={doctor.id} value={doctor.id}>
                  Dr. {doctor.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            margin="normal"
            required
            fullWidth
            type="date"
            name="appointmentDate"
            label="Appointment Date"
            InputLabelProps={{ shrink: true }}
            value={formData.appointmentDate}
            onChange={handleChange}
            inputProps={{
              min: new Date().toISOString().split('T')[0] // Disable past dates
            }}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            type="time"
            name="appointmentTime"
            label="Appointment Time"
            InputLabelProps={{ shrink: true }}
            value={formData.appointmentTime}
            onChange={handleChange}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            name="reason"
            label="Reason for Visit"
            multiline
            rows={4}
            value={formData.reason}
            onChange={handleChange}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3 }}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Book Appointment'}
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default AppointmentBooking;