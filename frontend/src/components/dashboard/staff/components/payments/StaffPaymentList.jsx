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
  Alert,
  CircularProgress,
  Chip
} from '@mui/material';

const StaffPaymentList = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const statusColors = {
    PENDING: 'warning',
    COMPLETED: 'success',
    FAILED: 'error'
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/staff/payments');
      if (!response.ok) {
        throw new Error('Failed to fetch payments');
      }
      const data = await response.json();
      setPayments(data);
    } catch (error) {
      setError('Error fetching payments: ' + error.message);
    } finally {
      setLoading(false);
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
      <Typography variant="h5" gutterBottom>
        Payment Management
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Patient Name</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Appointment Date</TableCell>
              <TableCell>Appointment Time</TableCell>
              <TableCell>Payment Date</TableCell>
              <TableCell>Payment Method</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {payments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell>{payment.patientName}</TableCell>
                <TableCell>₹{payment.amount}</TableCell>
                <TableCell>{payment.appointmentDate || 'N/A'}</TableCell>
                <TableCell>{payment.appointmentTime || 'N/A'}</TableCell>
                <TableCell>
                  {payment.paymentDate ? new Date(payment.paymentDate).toLocaleString() : 'Not Paid'}
                </TableCell>
                <TableCell>{payment.paymentMethod || 'N/A'}</TableCell>
                <TableCell>{payment.description}</TableCell>
                <TableCell>
                  <Chip
                    label={payment.status}
                    color={statusColors[payment.status] || 'default'}
                    size="small"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default StaffPaymentList;
