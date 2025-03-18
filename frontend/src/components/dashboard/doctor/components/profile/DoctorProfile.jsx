import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Avatar,
  Grid,
  TextField,
  Button,
  Divider,
  Snackbar,
  Alert
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';

const DoctorProfile = () => {
  const [profile, setProfile] = useState({
    name: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    department: '',
    dateOfBirth: '',
    gender: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({
    name: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    department: '',
    dateOfBirth: '',
    gender: ''
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    fetchDoctorProfile();
  }, []);

  const fetchDoctorProfile = async () => {
    try {
      const doctorId = localStorage.getItem('userId');
      const response = await fetch(`http://localhost:8080/api/users/${doctorId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }

      const data = await response.json();
      // Ensure all fields have at least empty string values
      const formattedData = {
        name: data.name || '',
        lastName: data.lastName || '',
        email: data.email || '',
        phone: data.phone || '',
        address: data.address || '',
        department: data.department || '',
        dateOfBirth: data.dateOfBirth || '',
        gender: data.gender || ''
      };
      setProfile(formattedData);
      setEditedProfile(formattedData);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setSnackbar({
        open: true,
        message: 'Error fetching profile',
        severity: 'error'
      });
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedProfile(profile);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      const doctorId = localStorage.getItem('userId');
      const response = await fetch(`http://localhost:8080/api/users/${doctorId}/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedProfile)
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || 'Failed to update profile');
      }

      const updatedData = await response.json();
      setProfile(updatedData);
      setIsEditing(false);
      setSnackbar({
        open: true,
        message: 'Profile updated successfully',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      setSnackbar({
        open: true,
        message: `Error updating profile: ${error.message}`,
        severity: 'error'
      });
    }
  };

  if (!profile) {
    return <Typography>Loading...</Typography>;
  }

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
            <Typography variant="h4">Dr. {profile.name}</Typography>
            <Typography variant="subtitle1" color="textSecondary">
              {profile.department}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="First Name"
              name="name"
              value={isEditing ? editedProfile.name : profile.name}
              onChange={handleChange}
              disabled={!isEditing}
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Last Name"
              name="lastName"
              value={isEditing ? editedProfile.lastName : profile.lastName}
              onChange={handleChange}
              disabled={!isEditing}
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              value={isEditing ? editedProfile.email : profile.email}
              onChange={handleChange}
              disabled={!isEditing}
              margin="normal"
              type="email"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Phone"
              name="phone"
              value={isEditing ? editedProfile.phone : profile.phone}
              onChange={handleChange}
              disabled={!isEditing}
              margin="normal"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Address"
              name="address"
              value={isEditing ? editedProfile.address : profile.address}
              onChange={handleChange}
              disabled={!isEditing}
              margin="normal"
              multiline
              rows={2}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Department"
              name="department"
              value={isEditing ? editedProfile.department : profile.department}
              onChange={handleChange}
              disabled={!isEditing}
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Date of Birth"
              name="dateOfBirth"
              type="date"
              value={isEditing ? editedProfile.dateOfBirth : profile.dateOfBirth}
              onChange={handleChange}
              disabled={!isEditing}
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        </Grid>

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          {!isEditing ? (
            <Button
              variant="contained"
              color="primary"
              onClick={handleEdit}
            >
              Edit Profile
            </Button>
          ) : (
            <>
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSave}
              >
                Save Changes
              </Button>
            </>
          )}
        </Box>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default DoctorProfile; 