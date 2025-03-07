import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  MenuItem,
  TextField,
  Chip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const StaffAppointmentList = () => {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [formData, setFormData] = useState({
    patientId: '',
    doctorId: '',
    department: '',
    appointmentDate: '',
    appointmentTime: '',
    reason: '',
    status: 'SCHEDULED'
  });

  const departments = [
    'CARDIOLOGY',
    'DERMATOLOGY',
    'NEUROLOGY',
    'ORTHOPEDICS',
    'PEDIATRICS',
    'PSYCHIATRY',
    'GENERAL_MEDICINE'
  ];

  const statusColors = {
    SCHEDULED: 'primary',
    COMPLETED: 'success',
    CANCELLED: 'error',
    RESCHEDULED: 'warning'
  };

  useEffect(() => {
    fetchAppointments();
    fetchDoctors();
    fetchPatients();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/staff/appointments');
      if (!response.ok) {
        throw new Error('Failed to fetch appointments');
      }
      const data = await response.json();
      setAppointments(data);
    } catch (error) {
      setError('Error fetching appointments: ' + error.message);
    }
  };

  const fetchDoctors = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/doctors');
      if (!response.ok) {
        throw new Error('Failed to fetch doctors');
      }
      const data = await response.json();
      setDoctors(data);
    } catch (error) {
      setError('Error fetching doctors: ' + error.message);
    }
  };

  const fetchPatients = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/staff/patients');
      if (!response.ok) {
        throw new Error('Failed to fetch patients');
      }
      const data = await response.json();
      setPatients(data);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (appointment = null) => {
    if (appointment) {
      setSelectedAppointment(appointment);
      setFormData({
        patientId: appointment.patientId,
        doctorId: appointment.doctorId,
        department: appointment.department,
        appointmentDate: appointment.appointmentDate,
        appointmentTime: appointment.appointmentTime,
        reason: appointment.reason,
        status: appointment.status
      });
    } else {
      setSelectedAppointment(null);
      setFormData({
        patientId: '',
        doctorId: '',
        department: '',
        appointmentDate: '',
        appointmentTime: '',
        reason: '',
        status: 'SCHEDULED'
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedAppointment(null);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = selectedAppointment
        ? `http://localhost:8080/api/staff/appointments/${selectedAppointment.id}`
        : 'http://localhost:8080/api/staff/appointments';

      const method = selectedAppointment ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save appointment');
      }

      await fetchAppointments();
      handleCloseDialog();
    } catch (error) {
      setError('Error saving appointment: ' + error.message);
    }
  };

  const handleDelete = async (appointmentId) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      try {
        const response = await fetch(`http://localhost:8080/api/staff/appointments/${appointmentId}`, {
          method: 'DELETE'
        });

        if (!response.ok) {
          throw new Error('Failed to delete appointment');
        }

        await fetchAppointments();
      } catch (error) {
        setError('Error deleting appointment: ' + error.message);
      }
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5">Manage Appointments</Typography>
        <Button
          variant="contained"
          onClick={() => handleOpenDialog()}
        >
          New Appointment
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Patient</TableCell>
              <TableCell>Doctor</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Reason</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {appointments.map((appointment) => (
              <TableRow key={appointment.id}>
                <TableCell>
                  {patients.find(p => p.id === appointment.patientId)?.name || 'Unknown'}
                </TableCell>
                <TableCell>
                  {doctors.find(d => d.id === appointment.doctorId)?.name || 'Unknown'}
                </TableCell>
                <TableCell>{appointment.department}</TableCell>
                <TableCell>{appointment.appointmentDate}</TableCell>
                <TableCell>{appointment.appointmentTime}</TableCell>
                <TableCell>{appointment.reason}</TableCell>
                <TableCell>
                  <Chip 
                    label={appointment.status} 
                    color={statusColors[appointment.status] || 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenDialog(appointment)} color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(appointment.id)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedAppointment ? 'Edit Appointment' : 'New Appointment'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 2 }}>
            <TextField
              fullWidth
              select
              label="Patient"
              value={formData.patientId}
              onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
              margin="normal"
              required
            >
              {patients.map((patient) => (
                <MenuItem key={patient.id} value={patient.id}>
                  {patient.name}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              fullWidth
              select
              label="Department"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              margin="normal"
              required
            >
              {departments.map((dept) => (
                <MenuItem key={dept} value={dept}>
                  {dept.replace('_', ' ')}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              fullWidth
              select
              label="Doctor"
              value={formData.doctorId}
              onChange={(e) => setFormData({ ...formData, doctorId: e.target.value })}
              margin="normal"
              required
            >
              {doctors
                .filter(doctor => !formData.department || doctor.department === formData.department)
                .map((doctor) => (
                  <MenuItem key={doctor.id} value={doctor.id}>
                    {doctor.name}
                  </MenuItem>
                ))}
            </TextField>

            <TextField
              fullWidth
              label="Date"
              type="date"
              value={formData.appointmentDate}
              onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })}
              margin="normal"
              required
              InputLabelProps={{
                shrink: true,
              }}
            />

            <TextField
              fullWidth
              label="Time"
              type="time"
              value={formData.appointmentTime}
              onChange={(e) => setFormData({ ...formData, appointmentTime: e.target.value })}
              margin="normal"
              required
              InputLabelProps={{
                shrink: true,
              }}
            />

            <TextField
              fullWidth
              label="Reason"
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              margin="normal"
              multiline
              rows={2}
              required
            />

            <TextField
              fullWidth
              select
              label="Status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              margin="normal"
              required
            >
              <MenuItem value="SCHEDULED">Scheduled</MenuItem>
              <MenuItem value="COMPLETED">Completed</MenuItem>
              <MenuItem value="CANCELLED">Cancelled</MenuItem>
              <MenuItem value="RESCHEDULED">Rescheduled</MenuItem>
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {selectedAppointment ? 'Update' : 'Create'} Appointment
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StaffAppointmentList; 