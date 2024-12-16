import React from 'react';
import "@/index.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import ProtectedRoute from '@/routes/ProtectedRoute';
import SignIn from '@/pages/Auth/SignIn';
import RootLayout from '@/components/Layouts/DashboardLayout';
import Unauthorized from '@/pages/Unauthorized';
import { useAuth } from '@/contexts/AuthContext';
import Dashboard from '@/pages/Dashboard/Dashboard';
import Attendance from '@/pages/Attendance/Attendance';
import Staff from '@/pages/Staff/Staff';
import Students from '@/pages/Students/Students';
import Classes from '@/pages/Classes/Classes';
import CreateClass from '@/pages/Classes/CreateClass';
import Profile from '@/pages/Profile/Profile';
import { PaymentCreateForm } from '@/components/Forms/PaymentCreateForm';
import { Toaster } from "@/components/ui/toaster";
import CreateStudent from './pages/Students/CreateStudent';
import GenerateQRCode from '../src/components/Forms/GenerateNewQRCode'; 
import AllQRCodes from '../src/components/Views/QRCodeTable'; 

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/signin" element={user ? <Navigate to="/dashboard" replace /> : <SignIn />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Protected routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute requiredRole={1}>
            <RootLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="attendance" element={<Attendance />} />
        <Route path="staff" element={<Staff />} />
        <Route path="students" element={<Students />} />
        <Route path="class/create" element={<CreateClass />} />
        <Route path="profile" element={<Profile />} />
        <Route path="/students" element={<Students />} />
        <Route path="/classes" element={<Classes />} />
        <Route path="/payments" element={<PaymentCreateForm />} />
        <Route path="/student/create" element={<CreateStudent />} />
        <Route path="/generate-qr" element={<GenerateQRCode />} />
        <Route path="/all-qr" element={<AllQRCodes />} />
      </Route>

      <Route path="*" element={<Navigate to="/signin" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
      <Toaster />
    </AuthProvider>
  );
}

export default App;
