import React from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Avatar
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';

const DoctorProfile = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Avatar
            sx={{
              width: 100,
              height: 100,
              bgcolor: 'primary.main',
              fontSize: '2rem'
            }}
          >
            <PersonIcon />
          </Avatar>
          <Box sx={{ ml: 3 }}>
            <Typography variant="h4">Doctor Profile</Typography>
            <Typography variant="subtitle1" color="textSecondary">
              View and manage your profile
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default DoctorProfile; 