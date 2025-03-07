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

      const response = await fetch(`http://localhost:8080/api/staff/appointments/patient/${patientId}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Server response:', errorData);
        throw new Error(`Server responded with ${response.status}: ${errorData}`);
      }

      const data = await response.json();
      console.log('Received appointments:', data);
      setAppointments(data);
    } catch (error) {
      console.error('Full error details:', error);
      setError('Error fetching appointments: ' + error.message);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleCancel = async (appointmentId) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      try {
        const response = await fetch(`http://localhost:8080/api/appointments/${appointmentId}/cancel`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          showSnackbar('Appointment cancelled successfully', 'success');
          fetchAppointments();
        } else {
          showSnackbar('Failed to cancel appointment', 'error');
        }
      } catch (error) {
        console.error('Error cancelling appointment:', error);
        showSnackbar('Error cancelling appointment', 'error');
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
      const response = await fetch(`http://localhost:8080/api/appointments/${selectedAppointment.id}/reschedule`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          newDate,
          newTime
        })
      });

      if (response.ok) {
        setOpenReschedule(false);
        showSnackbar('Appointment rescheduled successfully', 'success');
        fetchAppointments();
      } else {
        showSnackbar('Failed to reschedule appointment', 'error');
      }
    } catch (error) {
      console.error('Error rescheduling appointment:', error);
      showSnackbar('Error rescheduling appointment', 'error');
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'UPCOMING':
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
                  <TableCell>{appointment.doctorName}</TableCell>
                  <TableCell>{appointment.department}</TableCell>
                  <TableCell>{appointment.appointmentDate}</TableCell>
                  <TableCell>{appointment.appointmentTime}</TableCell>
                  <TableCell>
                    <Chip
                      label={appointment.status}
                      color={getStatusColor(appointment.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {appointment.status?.toUpperCase() === 'UPCOMING' && (
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
              margin="dense"
              label="New Date"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
            />
            <TextField
              margin="dense"
              label="New Time"
              type="time"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenReschedule(false)}>Cancel</Button>
            <Button onClick={handleReschedule} color="primary">
              Confirm
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Paper>
    </Container>
  );
};

export default AppointmentList;