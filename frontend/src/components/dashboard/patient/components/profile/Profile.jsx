import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Grid,
  Box,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Cake as BirthDateIcon,
  Home as AddressIcon
} from '@mui/icons-material';

const Profile = () => {
  const [profile, setProfile] = useState({
    name: 'Loading...',
    email: 'Loading...',
    phone: 'Loading...',
    dateOfBirth: 'Loading...',
    address: 'Loading...'
  });

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const response = await fetch(`http://localhost:8080/api/users/${userId}`);
      
      if (response.ok) {
        const data = await response.json();
        setProfile(data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Grid container spacing={3}>
          {/* Profile Header */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Avatar
                sx={{
                  width: 100,
                  height: 100,
                  bgcolor: 'primary.main',
                  fontSize: '2rem'
                }}
              >
                {profile.name?.charAt(0)?.toUpperCase()}
              </Avatar>
              <Box sx={{ ml: 3 }}>
                <Typography variant="h4">{profile.name}</Typography>
                <Typography variant="subtitle1" color="textSecondary">
                  Patient
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>

          {/* Profile Details */}
          <Grid item xs={12}>
            <List>
              <ListItem>
                <ListItemIcon>
                  <PersonIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Full Name"
                  secondary={profile.name}
                />
              </ListItem>

              <ListItem>
                <ListItemIcon>
                  <EmailIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Email"
                  secondary={profile.email}
                />
              </ListItem>

              <ListItem>
                <ListItemIcon>
                  <PhoneIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Phone Number"
                  secondary={profile.phone || 'Not provided'}
                />
              </ListItem>

              <ListItem>
                <ListItemIcon>
                  <BirthDateIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Date of Birth"
                  secondary={profile.dateOfBirth || 'Not provided'}
                />
              </ListItem>

              <ListItem>
                <ListItemIcon>
                  <AddressIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Address"
                  secondary={profile.address || 'Not provided'}
                />
              </ListItem>
            </List>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Profile; 