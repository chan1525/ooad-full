import React from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Container,
  Card,
  CardContent,
  Button,
} from '@mui/material';
import {
  CalendarMonth,
  MedicalInformation,
  Receipt,
  Payment,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const DashboardCard = ({ icon, title, value, onClick }) => (
  <Grid item xs={12} sm={6} md={3}>
    <Paper
      sx={{
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        cursor: 'pointer',
        '&:hover': {
          backgroundColor: 'rgba(0, 0, 0, 0.04)',
        },
      }}
      onClick={onClick}
    >
      <Box sx={{ p: 1 }}>
        {icon}
      </Box>
      <Typography component="h2" variant="h6" gutterBottom>
        {title}
      </Typography>
      <Typography variant="h4">
        {value}
      </Typography>
    </Paper>
  </Grid>
);

const PatientDashboard = () => {
  const navigate = useNavigate();

  const dashboardItems = [
    {
      title: 'Appointments',
      description: 'View and manage your appointments',
      action: () => navigate('appointments'),
      buttonText: 'View Appointments'
    },
    {
      title: 'Book Appointment',
      description: 'Schedule a new appointment',
      action: () => navigate('book-appointment'),
      buttonText: 'Book Now'
    },
    {
      title: 'Medical Records',
      description: 'Access your medical history',
      action: () => navigate('medical-records'),
      buttonText: 'View Records'
    },
    {
      title: 'Prescriptions',
      description: 'View your prescriptions',
      action: () => navigate('prescriptions'),
      buttonText: 'View Prescriptions'
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography component="h1" variant="h4" gutterBottom>
        Welcome, Patient
      </Typography>
      <Grid container spacing={3}>
        {dashboardItems.map((item, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {item.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {item.description}
                </Typography>
                <Button 
                  variant="contained" 
                  onClick={item.action}
                  fullWidth
                >
                  {item.buttonText}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default PatientDashboard;
