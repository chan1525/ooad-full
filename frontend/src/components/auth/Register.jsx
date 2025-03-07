import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    TextField, 
    Button, 
    Container, 
    Typography, 
    Box, 
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Alert
} from '@mui/material';

const Register = () => {
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: '',
        department: ''
    });

    const roles = ['PATIENT', 'DOCTOR', 'STAFF'];
    const departments = [
        'Cardiology',
        'Dermatology',
        'Neurology',
        'Orthopedics',
        'Pediatrics',
        'General Medicine',
        'Gynecology'
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const requestBody = {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                role: formData.role
            };

            if (formData.role === 'DOCTOR') {
                requestBody.department = formData.department;
            }

            console.log('Sending registration request:', requestBody);

            const response = await fetch('http://localhost:8080/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            });

            const data = await response.json();
            console.log('Registration response:', data);

            if (response.ok) {
                navigate('/login');
            } else {
                throw new Error(data.message || 'Registration failed');
            }
        } catch (error) {
            console.error('Registration error:', error);
            setError(error.message || 'Failed to register');
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Box sx={{ 
                marginTop: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}>
                <Typography component="h1" variant="h5">
                    Register
                </Typography>
                {error && (
                    <Alert severity="error" sx={{ mt: 2, width: '100%' }}>
                        {error}
                    </Alert>
                )}
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, width: '100%' }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="name"
                        label="Full Name"
                        name="name"
                        autoComplete="name"
                        value={formData.name}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="new-password"
                        value={formData.password}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        select
                        name="role"
                        label="Role"
                        value={formData.role}
                        onChange={handleChange}
                    >
                        {roles.map((role) => (
                            <MenuItem key={role} value={role}>
                                {role}
                            </MenuItem>
                        ))}
                    </TextField>

                    {formData.role === 'DOCTOR' && (
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            select
                            name="department"
                            label="Department"
                            value={formData.department}
                            onChange={handleChange}
                        >
                            {departments.map((dept) => (
                                <MenuItem key={dept} value={dept}>
                                    {dept}
                                </MenuItem>
                            ))}
                        </TextField>
                    )}

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Register
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default Register;
