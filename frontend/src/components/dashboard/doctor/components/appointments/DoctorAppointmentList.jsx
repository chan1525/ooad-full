import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  Box,
  CircularProgress
} from '@mui/material';
import PrescriptionForm from '../prescriptions/PrescriptionForm';

const DoctorAppointmentList = () => {
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const doctorId = localStorage.getItem('userId');
  const [selectedPatient, setSelectedPatient] = useState(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError('');
      console.log('Fetching appointments for doctor:', doctorId);
      
      const response = await fetch(`http://localhost:8080/api/appointments/doctor/${doctorId}`);
      const data = await response.json();
      
      if (response.ok) {
        console.log('Fetched appointments:', data);
        setAppointments(data);
      } else {
        console.error('Server error:', data);
        setError(typeof data === 'string' ? data : 'Failed to fetch appointments');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (appointmentId, newStatus) => {
    try {
      setError('');
      const response = await fetch(`http://localhost:8080/api/appointments/${appointmentId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        await fetchAppointments();
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to update appointment status');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Error connecting to server');
    }
  };

  const getStatusChip = (status) => {
    const colors = {
      UPCOMING: 'primary',
      COMPLETED: 'success',
      CANCELLED: 'error'
    };
    return <Chip label={status} color={colors[status] || 'default'} size="small" />;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        My Appointments
      </Typography>
      
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      {appointments.length === 0 ? (
        <Typography>No appointments found.</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Patient Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Time</TableCell>
                <TableCell>Department</TableCell>
                <TableCell>Reason</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {appointments.map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell>{appointment.patient?.name || 'N/A'}</TableCell>
                  <TableCell>{appointment.patient?.email || 'N/A'}</TableCell>
                  <TableCell>{appointment.appointmentDate}</TableCell>
                  <TableCell>{appointment.appointmentTime}</TableCell>
                  <TableCell>{appointment.department}</TableCell>
                  <TableCell>{appointment.reason}</TableCell>
                  <TableCell>{getStatusChip(appointment.status)}</TableCell>
                  <TableCell>
                    {appointment.status === 'UPCOMING' && (
                      <Box>
                        <Button
                          size="small"
                          color="primary"
                          onClick={() => handleStatusUpdate(appointment.id, 'COMPLETED')}
                          sx={{ mr: 1 }}
                        >
                          Complete
                        </Button>
                        <Button
                          size="small"
                          color="error"
                          onClick={() => handleStatusUpdate(appointment.id, 'CANCELLED')}
                        >
                          Cancel
                        </Button>
                      </Box>
                    )}
                    <Button
                      size="small"
                      color="primary"
                      onClick={() => setSelectedPatient(appointment.patient.id)}
                    >
                      Write Prescription
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {selectedPatient && (
        <PrescriptionForm 
          patientId={selectedPatient} 
          onPrescriptionCreated={() => setSelectedPatient(null)}
        />
      )}
    </Box>
  );
};

export default DoctorAppointmentList; 