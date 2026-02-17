import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/auth/Login';
// School Admin Pages
import SchoolAdminDashboard from './pages/admin/Dashboard';
import StudentsPage from './pages/admin/Students';
import StaffPage from './pages/admin/Staff';
import ClassesPage from './pages/admin/Classes';
import AttendancePage from './pages/admin/Attendance';
import ExamsPage from './pages/admin/Exams';
import ResultsPage from './pages/admin/Results';
import FeesPage from './pages/admin/Fees';
import LibraryPage from './pages/admin/Library';
import TransportPage from './pages/admin/Transport';
import NotificationsPage from './pages/admin/Notifications';

// Teacher Pages
import TeacherDashboard from './pages/teacher/Dashboard';
import TeacherAttendance from './pages/teacher/Attendance';
import TeacherResults from './pages/teacher/Results';

// Student Pages
import StudentDashboard from './pages/student/Dashboard';
// Parent Pages
import ParentDashboard from './pages/parent/Dashboard';
// Maintenance Page
import MaintenanceDashboard from './pages/maintenance/Dashboard';

import { useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './layouts/DashboardLayout';

// Public Pages
import Home from './pages/public/Home';
import Contact from './pages/public/Contact';

function App() {
    return (
        <Routes>
            {/* Public Marketing Website Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/contact" element={<Contact />} />

            {/* Authentication */}
            <Route path="/login" element={<Login />} />

            {/* Protected Dashboard Routes - Wrapped in DashboardLayout */}
            <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
                {/* Super Admin */}
                <Route path="/superadmin/*" element={<ProtectedRoute allowedRoles={['superadmin']}><SuperAdminDashboard /></ProtectedRoute>} />

                {/* School Admin */}
                <Route path="/schooladmin" element={<ProtectedRoute allowedRoles={['schooladmin']} />}>
                    <Route index element={<SchoolAdminDashboard />} />
                    <Route path="students" element={<StudentsPage />} />
                    <Route path="staff" element={<StaffPage />} />
                    <Route path="classes" element={<ClassesPage />} />
                    <Route path="attendance" element={<AttendancePage />} />
                    <Route path="exams" element={<ExamsPage />} />
                    <Route path="results" element={<ResultsPage />} />
                    <Route path="fees" element={<FeesPage />} />
                    <Route path="library" element={<LibraryPage />} />
                    <Route path="transport" element={<TransportPage />} />
                    <Route path="notifications" element={<NotificationsPage />} />
                </Route>

                {/* Teacher */}
                <Route path="/teacher" element={<ProtectedRoute allowedRoles={['teacher']} />}>
                    <Route index element={<TeacherDashboard />} />
                    <Route path="attendance" element={<TeacherAttendance />} />
                    <Route path="results" element={<TeacherResults />} />
                    <Route path="library" element={<LibraryPage />} />
                </Route>

                {/* Student */}
                <Route path="/student" element={<ProtectedRoute allowedRoles={['student']} />}>
                    <Route index element={<StudentDashboard />} />
                    <Route path="library" element={<LibraryPage />} />
                </Route>

                {/* Parent */}
                <Route path="/parent" element={<ProtectedRoute allowedRoles={['parent']} />}>
                    <Route index element={<ParentDashboard />} />
                </Route>

                {/* Maintenance */}
                <Route path="/maintenance" element={<ProtectedRoute allowedRoles={['maintenance']} />}>
                    <Route index element={<MaintenanceDashboard />} />
                </Route>
            </Route>

            {/* Fallback for unknown routes */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

export default App;
