import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/auth/Login';
import Register from './components/auth/Register';

// Layouts
import PatientDashboardLayout from './components/dashboard/patient/layout/PatientDashboardLayout';
import DoctorDashboardLayout from './components/dashboard/doctor/layout/DoctorDashboardLayout';
import StaffDashboardLayout from './components/dashboard/staff/layout/StaffDashboardLayout';

// Components
import PatientDashboard from './components/dashboard/patient/PatientDashboard';
import DoctorDashboard from './components/dashboard/doctor/DoctorDashboard';
import StaffDashboard from './components/dashboard/staff/StaffDashboard';

// Patient Components
import AppointmentList from './components/dashboard/patient/components/appointments/AppointmentList';
import AppointmentBooking from './components/dashboard/patient/components/appointments/AppointmentBooking';
import Profile from './components/dashboard/patient/components/profile/Profile';
import MedicalRecords from './components/dashboard/patient/components/medical-records/MedicalRecords';

// Staff Components
import StaffPatientList from './components/dashboard/staff/components/patients/PatientList';
import StaffAppointmentList from './components/dashboard/staff/components/appointments/StaffAppointmentList';

function App() {
  return (
    <Routes>
      {/* Root redirect to login */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Patient Routes */}
      <Route path="/patient/dashboard" element={<PatientDashboardLayout />}>
        <Route index element={<PatientDashboard />} />
        <Route path="appointments" element={<AppointmentList />} />
        <Route path="appointments/book" element={<AppointmentBooking />} />
        <Route path="medical-records" element={<MedicalRecords />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      {/* Doctor Routes */}
      <Route path="/doctor/dashboard" element={<DoctorDashboardLayout />}>
        <Route index element={<DoctorDashboard />} />
      </Route>

      {/* Staff Routes */}
      <Route path="/staff/dashboard" element={<StaffDashboardLayout />}>
        <Route index element={<StaffDashboard />} />
        <Route path="patients" element={<StaffPatientList />} />
        <Route path="appointments" element={<StaffAppointmentList />} />
      </Route>
    </Routes>
  );
}

export default App;