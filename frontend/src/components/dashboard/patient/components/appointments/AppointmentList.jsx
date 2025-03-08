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
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const AppointmentList = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [openReschedule, setOpenReschedule] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [error, setError] = useState('');

  const fetchAppointments = async () => {
    try {
      const patientId = localStorage.getItem('userId');
      console.log('Fetching appointments for patient ID:', patientId);
      
      if (!patientId) {
        throw new Error('User ID not found');
      }

      const response = await fetch(`http://localhost:8080/api/appointments/patient/${patientId}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Response error:', errorText);
        throw new Error('Failed to fetch appointments');
      }

      const data = await response.json();
      console.log('Received appointments:', data);
      setAppointments(data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setError('Error fetching appointments: ' + error.message);
    }
  };

  const fetchDoctors = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/doctors');
      if (response.ok) {
        const data = await response.json();
        setDoctors(data);
      }
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  useEffect(() => {
    fetchAppointments();
    fetchDoctors();
  }, []);

  const handleCancel = async (appointmentId) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      try {
        const response = await fetch(`http://localhost:8080/api/appointments/${appointmentId}/cancel`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // Add any authentication headers if needed
          }
        });
        
        if (response.ok) {
          setSnackbar({ open: true, message: 'Appointment cancelled successfully', severity: 'success' });
          fetchAppointments(); // Refresh the list
        } else {
          setSnackbar({ open: true, message: 'Failed to cancel appointment', severity: 'error' });
        }
      } catch (error) {
        console.error('Error cancelling appointment:', error);
        setSnackbar({ open: true, message: 'Error cancelling appointment', severity: 'error' });
      }
    }
  };

  const openRescheduleDialog = (appointment) => {
    setSelectedAppointment(appointment);
    setNewDate(appointment.appointmentDate);
    setNewTime(appointment.appointmentTime);
    setOpenReschedule(true);
  };

  const handleReschedule = async () => {
    try {
      // Convert date and time to proper format
      const formattedDate = newDate; // Should be in YYYY-MM-DD format
      const formattedTime = newTime; // Should be in HH:mm format

      const response = await fetch(`http://localhost:8080/api/appointments/${selectedAppointment.id}/reschedule`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          newDate: formattedDate,
          newTime: formattedTime
        })
      });

      const data = await response.json();

      if (response.ok) {
        setOpenReschedule(false);
        setSnackbar({
          open: true,
          message: 'Appointment rescheduled successfully',
          severity: 'success'
        });
        fetchAppointments(); // Refresh the list
      } else {
        console.error('Server error:', data);
        setSnackbar({
          open: true,
          message: data.message || 'Failed to reschedule appointment',
          severity: 'error'
        });
      }
    } catch (error) {
      console.error('Error:', error);
      setSnackbar({
        open: true,
        message: 'Error connecting to server',
        severity: 'error'
      });
    }
  };

  const getDoctorName = (doctorId) => {
    const doctor = doctors.find(d => d.id === doctorId);
    return doctor ? `Dr. ${doctor.name}` : 'Unknown Doctor';
  };

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'SCHEDULED':
        return 'primary';
      case 'COMPLETED':
        return 'success';
      case 'CANCELLED':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          My Appointments
        </Typography>
        <Button
          variant="contained"
          color="primary"
          sx={{ mb: 3 }}
          onClick={() => navigate('/patient/dashboard/appointments/book')}
        >
          Book New Appointment
        </Button>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Doctor</TableCell>
                <TableCell>Department</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Time</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {appointments.map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell>{getDoctorName(appointment.doctorId)}</TableCell>
                  <TableCell>{appointment.department}</TableCell>
                  <TableCell>{appointment.appointmentDate}</TableCell>
                  <TableCell>{appointment.appointmentTime}</TableCell>
                  <TableCell>
                    <Chip
                      label={appointment.status || 'SCHEDULED'}
                      color={getStatusColor(appointment.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {appointment.status === 'SCHEDULED' && (
                      <>
                        <Button
                          size="small"
                          color="primary"
                          sx={{ mr: 1 }}
                          onClick={() => openRescheduleDialog(appointment)}
                        >
                          Reschedule
                        </Button>
                        <Button
                          size="small"
                          color="error"
                          onClick={() => handleCancel(appointment.id)}
                        >
                          Cancel
                        </Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Reschedule Dialog */}
        <Dialog open={openReschedule} onClose={() => setOpenReschedule(false)}>
          <DialogTitle>Reschedule Appointment</DialogTitle>
          <DialogContent>
            <TextField
              label="Date"
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Time"
              type="time"
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenReschedule(false)}>Cancel</Button>
            <Button onClick={handleReschedule} color="primary">
              Reschedule
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Paper>
    </Container>
  );
};

export default AppointmentList;