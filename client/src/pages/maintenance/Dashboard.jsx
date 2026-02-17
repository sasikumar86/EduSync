import { useAuth } from '../../contexts/AuthContext';

export default function MaintenanceDashboard() {
    const { user, logout } = useAuth();

    return (
        <div className="p-6">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-surface-900">Maintenance Dashboard</h1>
                <p className="text-surface-500">Welcome back, {user?.name}</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-surface-200">
                    <h3 className="text-sm font-medium text-surface-500 mb-2">Pending Requests</h3>
                    <p className="text-3xl font-bold text-orange-600">12</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-surface-200">
                    <h3 className="text-sm font-medium text-surface-500 mb-2">In Progress</h3>
                    <p className="text-3xl font-bold text-blue-600">5</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-surface-200">
                    <h3 className="text-sm font-medium text-surface-500 mb-2">Completed This Month</h3>
                    <p className="text-3xl font-bold text-green-600">28</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-surface-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-surface-200">
                    <h3 className="font-semibold text-surface-900">Recent Maintenance Requests</h3>
                </div>
                <div className="p-6">
                    <p className="text-surface-500 text-center py-8">No recent requests found.</p>
                </div>
            </div>
        </div>
    );
}
