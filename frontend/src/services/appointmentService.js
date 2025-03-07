import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

const appointmentService = {
    getAllAppointments: async () => {
        const response = await axios.get(`${API_URL}/appointments`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        return response.data;
    },

    bookAppointment: async (appointmentData) => {
        const response = await axios.post(`${API_URL}/appointments`, appointmentData, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        return response.data;
    },

    cancelAppointment: async (appointmentId) => {
        const response = await axios.delete(`${API_URL}/appointments/${appointmentId}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        return response.data;
    },

    rescheduleAppointment: async (appointmentId, newData) => {
        const response = await axios.put(`${API_URL}/appointments/${appointmentId}`, newData, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        return response.data;
    }
};

export default appointmentService;
