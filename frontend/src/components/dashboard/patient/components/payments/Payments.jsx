import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  Alert
} from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ReceiptIcon from '@mui/icons-material/Receipt';
import PaymentsIcon from '@mui/icons-material/Payments';

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [openPayDialog, setOpenPayDialog] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [unpaidAppointments, setUnpaidAppointments] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const patientId = localStorage.getItem('userId');

  useEffect(() => {
    fetchPayments();
    fetchUnpaidAppointments();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/payments/patient/${patientId}`);
      const data = await response.json();
      setPayments(data);
    } catch (error) {
      setError('Failed to fetch payments');
    }
  };

  const fetchUnpaidAppointments = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/appointments/unpaid/${patientId}`);
      const data = await response.json();
      setUnpaidAppointments(data);
    } catch (error) {
      setError('Failed to fetch unpaid appointments');
    }
  };

  const handlePayment = async (appointmentId, amount) => {
    try {
      const response = await fetch('http://localhost:8080/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          appointmentId,
          patientId,
          amount,
          paymentMethod: 'CASH', // Simple payment method
          status: 'COMPLETED'
        })
      });

      if (response.ok) {
        setSuccess('Payment successful!');
        fetchPayments();
        fetchUnpaidAppointments();
        setOpenPayDialog(false);
      } else {
        setError('Payment failed');
      }
    } catch (error) {
      setError('Error processing payment');
    }
  };

  const getStatusColor = (status) => {
    return status === 'COMPLETED' ? 'success' : 'error';
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <Grid container spacing={3}>
        {/* Payment Summary Cards */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Pending Payments
            </Typography>
            {unpaidAppointments.length > 0 ? (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Appointment Date</TableCell>
                      <TableCell>Doctor</TableCell>
                      <TableCell>Amount</TableCell>
                      <TableCell>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {unpaidAppointments.map((appointment) => (
                      <TableRow key={appointment.id}>
                        <TableCell>{appointment.appointmentDate}</TableCell>
                        <TableCell>{appointment.doctorName}</TableCell>
                        <TableCell>₹{appointment.amount}</TableCell>
                        <TableCell>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => {
                              setSelectedAppointment(appointment);
                              setOpenPayDialog(true);
                            }}
                          >
                            Pay Now
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography>No pending payments</Typography>
            )}
          </Paper>
        </Grid>

        {/* Payment History */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Payment History
            </Typography>
            {payments.length > 0 ? (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell>Amount</TableCell>
                      <TableCell>Payment Method</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {payments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell>{new Date(payment.paymentDate).toLocaleDateString()}</TableCell>
                        <TableCell>₹{payment.amount}</TableCell>
                        <TableCell>{payment.paymentMethod}</TableCell>
                        <TableCell>
                          <Chip
                            label={payment.status}
                            color={getStatusColor(payment.status)}
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography>No payment history</Typography>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Payment Dialog */}
      <Dialog open={openPayDialog} onClose={() => setOpenPayDialog(false)}>
        <DialogTitle>Complete Payment</DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            Appointment Date: {selectedAppointment?.appointmentDate}
          </Typography>
          <Typography variant="body1" gutterBottom>
            Doctor: {selectedAppointment?.doctorName}
          </Typography>
          <Typography variant="h6" gutterBottom>
            Amount: ₹{selectedAppointment?.amount}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPayDialog(false)}>Cancel</Button>
          <Button
            onClick={() => handlePayment(selectedAppointment.id, selectedAppointment.amount)}
            variant="contained"
            color="primary"
          >
            Confirm Payment
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Payments; 