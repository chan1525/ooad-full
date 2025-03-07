import React from 'react';
import {
  Container,
  Paper,
  Typography,
  Box
} from '@mui/material';
import InboxOutlinedIcon from '@mui/icons-material/InboxOutlined';

const PatientList = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          My Patients
        </Typography>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            py: 8
          }}
        >
          <InboxOutlinedIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            No Patients Found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Your patient list will appear here.
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default PatientList; 