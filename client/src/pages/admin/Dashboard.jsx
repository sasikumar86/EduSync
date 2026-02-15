import { useEffect, useState } from 'react';
import { Users, UserCog, GraduationCap, DollarSign, TrendingUp, ClipboardList, Calendar, Bell } from 'lucide-react';
import api from '../../services/api';

const StatCard = ({ icon: Icon, label, value, color, trend }) => (
    <div className="bg-white rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-all duration-300 border border-surface-100 group">
        <div className="flex items-center justify-between mb-3">
            <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center group-hover:scale-110 transition-transform`}><Icon size={22} className="text-white" /></div>
            {trend && <span className="text-xs font-medium text-accent-600 bg-accent-50 px-2 py-0.5 rounded-full">{trend}</span>}
        </div>
        <p className="text-2xl font-bold text-surface-900">{value}</p>
        <p className="text-sm text-surface-500 mt-0.5">{label}</p>
    </div>
);

export default function AdminDashboard() {
    const [stats, setStats] = useState(null);
    useEffect(() => { api.get('/dashboard/stats').then((r) => setStats(r.data.data)).catch(() => { }); }, []);

    const cards = [
        { icon: Users, label: 'Total Students', value: stats?.totalStudents || 0, color: 'from-primary-500 to-primary-700', trend: '+12%' },
        { icon: UserCog, label: 'Total Staff', value: stats?.totalStaff || 0, color: 'from-amber-500 to-amber-700' },
        { icon: GraduationCap, label: 'Total Classes', value: stats?.totalClasses || 0, color: 'from-purple-500 to-purple-700' },
        { icon: ClipboardList, label: 'Attendance Rate', value: `${stats?.attendanceRate || 0}%`, color: 'from-accent-500 to-accent-700', trend: 'Today' },
        { icon: DollarSign, label: 'Monthly Revenue', value: `₹${(stats?.monthlyRevenue || 0).toLocaleString()}`, color: 'from-cyan-500 to-cyan-700' },
        { icon: Calendar, label: 'Academic Year', value: '2025-26', color: 'from-rose-500 to-rose-700' },
    ];

    return (
        <div className="space-y-6 animate-fade-in">
            <div><h1 className="text-2xl font-bold text-surface-900">School Dashboard</h1><p className="text-surface-500 text-sm mt-1">Overview of your school's performance & activities</p></div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {cards.map((c) => <StatCard key={c.label} {...c} />)}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Payments */}
                <div className="bg-white rounded-2xl shadow-card border border-surface-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-surface-100 flex items-center justify-between">
                        <h2 className="font-semibold text-surface-900">Recent Fee Payments</h2>
                        <DollarSign size={18} className="text-surface-400" />
                    </div>
                    <div className="divide-y divide-surface-100">
                        {(stats?.recentPayments || []).map((p, i) => (
                            <div key={i} className="px-6 py-3 flex items-center justify-between hover:bg-surface-50 transition-colors">
                                <div>
                                    <p className="text-sm font-medium text-surface-900">{p.student?.user?.name || 'Student'}</p>
                                    <p className="text-xs text-surface-400">{new Date(p.date).toLocaleDateString()}</p>
                                </div>
                                <span className="text-sm font-semibold text-accent-600">₹{p.amount?.toLocaleString()}</span>
                            </div>
                        ))}
                        {(!stats?.recentPayments || stats.recentPayments.length === 0) && <p className="px-6 py-4 text-sm text-surface-400">No recent payments</p>}
                    </div>
                </div>

                {/* Recent Notifications */}
                <div className="bg-white rounded-2xl shadow-card border border-surface-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-surface-100 flex items-center justify-between">
                        <h2 className="font-semibold text-surface-900">Recent Notifications</h2>
                        <Bell size={18} className="text-surface-400" />
                    </div>
                    <div className="divide-y divide-surface-100">
                        {(stats?.recentNotifications || []).map((n, i) => (
                            <div key={i} className="px-6 py-3 hover:bg-surface-50 transition-colors">
                                <p className="text-sm font-medium text-surface-900">{n.title}</p>
                                <p className="text-xs text-surface-500 mt-0.5 line-clamp-1">{n.message}</p>
                            </div>
                        ))}
                        {(!stats?.recentNotifications || stats.recentNotifications.length === 0) && <p className="px-6 py-4 text-sm text-surface-400">No recent notifications</p>}
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl p-6 shadow-card border border-surface-100">
                <h2 className="font-semibold text-surface-900 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[{ label: 'Add Student', icon: Users, path: '/admin/students', c: 'from-primary-500 to-primary-600' },
                    { label: 'Mark Attendance', icon: ClipboardList, path: '/admin/attendance', c: 'from-accent-500 to-accent-600' },
                    { label: 'View Results', icon: GraduationCap, path: '/admin/results', c: 'from-purple-500 to-purple-600' },
                    { label: 'Collect Fee', icon: DollarSign, path: '/admin/fees', c: 'from-amber-500 to-amber-600' },
                    ].map((a) => (
                        <a key={a.label} href={a.path} className="flex flex-col items-center gap-2 p-4 rounded-xl bg-surface-50 hover:bg-surface-100 transition-all group">
                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${a.c} flex items-center justify-center group-hover:scale-110 transition-transform`}><a.icon size={20} className="text-white" /></div>
                            <span className="text-xs font-medium text-surface-700">{a.label}</span>
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
}
