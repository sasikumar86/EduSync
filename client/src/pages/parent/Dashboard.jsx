import { useEffect, useState } from 'react';
import { Users, ClipboardList, Award, DollarSign, Calendar, BookOpen, Bell, TrendingUp } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';

export default function ParentDashboard() {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState([]);
    useEffect(() => { api.get('/notifications').then((r) => setNotifications((r.data.data || []).slice(0, 5))).catch(() => { }); }, []);

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Welcome */}
            <div className="bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl p-6 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-12 -mt-12"></div>
                <h1 className="text-2xl font-bold relative z-10">Welcome, {user?.name?.split(' ')[0]}! 👨‍👩‍👦</h1>
                <p className="text-white/80 mt-1 relative z-10">Track your child's academic progress and activities</p>
            </div>

            {/* Child Overview Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { icon: ClipboardList, label: 'Attendance', value: '92%', color: 'from-primary-500 to-primary-700', detail: 'Present: 184/200 days' },
                    { icon: Award, label: 'Overall Grade', value: 'A', color: 'from-accent-500 to-accent-700', detail: 'GPA: 3.75' },
                    { icon: DollarSign, label: 'Fee Status', value: 'Paid', color: 'from-emerald-500 to-emerald-700', detail: 'Next due: March 15' },
                    { icon: TrendingUp, label: 'Class Rank', value: '#5', color: 'from-purple-500 to-purple-700', detail: 'Out of 40 students' },
                ].map((s) => (
                    <div key={s.label} className="bg-white rounded-2xl p-5 shadow-card border border-surface-100">
                        <div className="flex items-center gap-3 mb-2">
                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center`}><s.icon size={20} className="text-white" /></div>
                            <p className="text-surface-500 text-sm">{s.label}</p>
                        </div>
                        <p className="text-2xl font-bold text-surface-900">{s.value}</p>
                        <p className="text-xs text-surface-400 mt-1">{s.detail}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Child's Academic Performance */}
                <div className="bg-white rounded-2xl shadow-card border border-surface-100 p-6">
                    <h2 className="font-semibold text-surface-900 mb-4 flex items-center gap-2"><BookOpen size={18} className="text-primary-500" /> Subject Performance</h2>
                    <div className="space-y-3">
                        {[{ sub: 'Mathematics', score: 92, grade: 'A+', max: 100 }, { sub: 'Science', score: 88, grade: 'A', max: 100 }, { sub: 'English', score: 85, grade: 'A', max: 100 }, { sub: 'Hindi', score: 90, grade: 'A+', max: 100 }, { sub: 'Social Studies', score: 78, grade: 'B+', max: 100 }].map((s) => (
                            <div key={s.sub} className="space-y-1">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-surface-700">{s.sub}</span>
                                    <span className="text-xs font-semibold text-surface-500">{s.score}/{s.max}</span>
                                </div>
                                <div className="w-full h-2 bg-surface-100 rounded-full overflow-hidden">
                                    <div className={`h-full rounded-full transition-all duration-500 ${s.score >= 90 ? 'bg-accent-500' : s.score >= 75 ? 'bg-primary-500' : 'bg-amber-500'}`} style={{ width: `${s.score}%` }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Notifications */}
                <div className="bg-white rounded-2xl shadow-card border border-surface-100 p-6">
                    <h2 className="font-semibold text-surface-900 mb-4 flex items-center gap-2"><Bell size={18} className="text-amber-500" /> School Notifications</h2>
                    <div className="space-y-3">
                        {notifications.length > 0 ? notifications.map((n) => (
                            <div key={n._id} className="p-3 bg-surface-50 rounded-xl hover:bg-surface-100 transition-colors">
                                <p className="text-sm font-medium text-surface-800">{n.title}</p>
                                <p className="text-xs text-surface-400 mt-0.5 line-clamp-2">{n.message}</p>
                                <p className="text-xs text-surface-300 mt-1">{new Date(n.createdAt).toLocaleDateString()}</p>
                            </div>
                        )) : (
                            <p className="text-sm text-surface-400 text-center py-6">No notifications</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Weekly Activity */}
            <div className="bg-white rounded-2xl shadow-card border border-surface-100 p-6">
                <h2 className="font-semibold text-surface-900 mb-4 flex items-center gap-2"><Calendar size={18} className="text-primary-500" /> This Week's Activities</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {[
                        { day: 'Monday', activity: 'Science Project Due', type: 'Academic' },
                        { day: 'Tuesday', activity: 'Parent-Teacher Meeting', type: 'Event' },
                        { day: 'Wednesday', activity: 'Sports Day Practice', type: 'Sports' },
                        { day: 'Thursday', activity: 'Math Quiz', type: 'Exam' },
                        { day: 'Friday', activity: 'Art Class Exhibition', type: 'Event' },
                        { day: 'Saturday', activity: 'Library Day', type: 'General' },
                    ].map((a) => (
                        <div key={a.day} className="p-3 bg-surface-50 rounded-xl flex items-center gap-3">
                            <div className="w-12 text-center"><p className="text-xs text-surface-400">{a.day}</p></div>
                            <div className="flex-1"><p className="text-sm font-medium text-surface-800">{a.activity}</p><span className="text-xs text-primary-600">{a.type}</span></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
