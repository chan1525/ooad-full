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
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Alert
} from '@mui/material';
import PrescriptionForm from '../prescriptions/PrescriptionForm';

const DoctorAppointmentList = () => {
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const doctorId = localStorage.getItem('userId');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [openReschedule, setOpenReschedule] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

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
      if (newStatus === 'CANCELLED') {
        const response = await fetch(`http://localhost:8080/api/appointments/${appointmentId}/cancel`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        const data = await response.json().catch(() => null); // Handle empty response
        
        if (response.ok) {
          await fetchAppointments();
          setSnackbar({
            open: true,
            message: data?.message || 'Appointment cancelled successfully',
            severity: 'success'
          });
        } else {
          throw new Error(data?.message || 'Failed to cancel appointment');
        }
      } else {
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
      }
    } catch (error) {
      console.error('Error:', error);
      setSnackbar({
        open: true,
        message: error.message || 'Error connecting to server',
        severity: 'error'
      });
    }
  };

  const getStatusChip = (status) => {
    const colors = {
      SCHEDULED: 'primary',
      COMPLETED: 'success',
      CANCELLED: 'error'
    };
    return <Chip label={status} color={colors[status] || 'default'} size="small" />;
  };

  const openRescheduleDialog = (appointment) => {
    setSelectedAppointment(appointment);
    setNewDate(appointment.appointmentDate);
    setNewTime(appointment.appointmentTime);
    setOpenReschedule(true);
  };

  const handleReschedule = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/appointments/${selectedAppointment.id}/reschedule`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          newDate: newDate,
          newTime: newTime
        })
      });

      if (response.ok) {
        setOpenReschedule(false);
        setSnackbar({
          open: true,
          message: 'Appointment rescheduled successfully',
          severity: 'success'
        });
        fetchAppointments(); // Refresh the list
      } else {
        const data = await response.json();
        throw new Error(data.message || 'Failed to reschedule appointment');
      }
    } catch (error) {
      console.error('Error:', error);
      setSnackbar({
        open: true,
        message: error.message,
        severity: 'error'
      });
    }
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
                  <TableCell>{appointment.patientName}</TableCell>
                  <TableCell>{appointment.patientEmail || 'N/A'}</TableCell>
                  <TableCell>{appointment.appointmentDate}</TableCell>
                  <TableCell>{appointment.appointmentTime}</TableCell>
                  <TableCell>{appointment.department}</TableCell>
                  <TableCell>{appointment.reason}</TableCell>
                  <TableCell>{getStatusChip(appointment.status)}</TableCell>
                  <TableCell>
                    {appointment.status === 'SCHEDULED' && (
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
                          color="warning"
                          onClick={() => openRescheduleDialog(appointment)}
                          sx={{ mr: 1 }}
                        >
                          Reschedule
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
            inputProps={{
              min: new Date().toISOString().split('T')[0] // Disable past dates
            }}
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

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          severity={snackbar.severity} 
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DoctorAppointmentList; 