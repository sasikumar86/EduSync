import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/auth/Login';
import SuperAdminDashboard from './pages/superadmin/Dashboard';
import SchoolAdminDashboard from './pages/admin/Dashboard'; // Assuming 'admin' folder holds School Admin
import TeacherDashboard from './pages/teacher/Dashboard';
import StudentDashboard from './pages/student/Dashboard';
import ParentDashboard from './pages/parent/Dashboard';
import MaintenanceDashboard from './pages/maintenance/Dashboard';
import { useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './layouts/DashboardLayout';

// Public Pages
import Home from './pages/public/Home';
import Contact from './pages/public/Contact';

function App() {
    const { user } = useAuth();

    return (
        <Routes>
            {/* Public Marketing Website Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<Home />} /> {/* Placeholder: redirect to Home for now until created */}
            <Route path="/products" element={<Home />} /> {/* Placeholder */}
            <Route path="/pricing" element={<Home />} /> {/* Placeholder */}
            <Route path="/contact" element={<Contact />} />

            {/* Authentication */}
            <Route path="/login" element={<Login />} />

            {/* Protected Dashboard Routes - Wrapped in DashboardLayout */}
            <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
                <Route path="/superadmin/*" element={
                    <ProtectedRoute allowedRoles={['superadmin']}>
                        <SuperAdminDashboard />
                    </ProtectedRoute>
                } />

                <Route path="/schooladmin/*" element={
                    <ProtectedRoute allowedRoles={['schooladmin']}>
                        <SchoolAdminDashboard />
                    </ProtectedRoute>
                } />

                <Route path="/teacher/*" element={
                    <ProtectedRoute allowedRoles={['teacher']}>
                        <TeacherDashboard />
                    </ProtectedRoute>
                } />

                <Route path="/student/*" element={
                    <ProtectedRoute allowedRoles={['student']}>
                        <StudentDashboard />
                    </ProtectedRoute>
                } />

                <Route path="/parent/*" element={
                    <ProtectedRoute allowedRoles={['parent']}>
                        <ParentDashboard />
                    </ProtectedRoute>
                } />

                <Route path="/maintenance/*" element={
                    <ProtectedRoute allowedRoles={['maintenance']}>
                        <MaintenanceDashboard />
                    </ProtectedRoute>
                } />
            </Route>

            {/* Fallback for unknown routes */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

export default App;
