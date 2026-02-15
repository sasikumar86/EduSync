
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function ProtectedRoute({ children, allowedRoles }) {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // Redirect to their appropriate dashboard if they try to access a route they don't have permission for
        switch (user.role) {
            case 'superadmin':
                return <Navigate to="/superadmin" replace />;
            case 'schooladmin':
                return <Navigate to="/schooladmin" replace />;
            case 'teacher':
                return <Navigate to="/teacher" replace />;
            case 'student':
                return <Navigate to="/student" replace />;
            case 'parent':
                return <Navigate to="/parent" replace />;
            default:
                return <Navigate to="/" replace />;
        }
    }

    return children;
}
