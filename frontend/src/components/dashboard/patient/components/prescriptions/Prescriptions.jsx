import React from 'react';
import {
  Container,
  Paper,
  Typography,
  Box
} from '@mui/material';
import InboxOutlinedIcon from '@mui/icons-material/InboxOutlined';

const Prescriptions = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          My Prescriptions
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
            No Prescriptions Found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Your prescriptions will appear here when they are added by your doctor.
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Prescriptions; 