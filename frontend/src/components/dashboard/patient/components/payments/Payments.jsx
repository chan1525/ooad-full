import React from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Card,
  CardContent
} from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ReceiptIcon from '@mui/icons-material/Receipt';
import PaymentsIcon from '@mui/icons-material/Payments';

const Payments = () => {
  // For now, using static data since we haven't added any payments
  const summary = {
    totalPaid: "₹0.00",
    pendingPayments: "₹0.00",
    lastPayment: "No payments yet"
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Payments & Billing
        </Typography>

        {/* Summary Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <AccountBalanceWalletIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">Total Paid</Typography>
                </Box>
                <Typography variant="h4">{summary.totalPaid}</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <ReceiptIcon color="error" sx={{ mr: 1 }} />
                  <Typography variant="h6">Pending Payments</Typography>
                </Box>
                <Typography variant="h4">{summary.pendingPayments}</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <PaymentsIcon color="success" sx={{ mr: 1 }} />
                  <Typography variant="h6">Last Payment</Typography>
                </Box>
                <Typography variant="h4">{summary.lastPayment}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* No Payment History Message */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            py: 8
          }}
        >
          <PaymentsIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            No Payment History
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Your payment history will appear here once you make payments.
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Payments; 