import { useEffect, useState } from 'react';
import { Users, ClipboardList, BookOpen, Calendar, FileText } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';

export default function TeacherDashboard() {
    const { user } = useAuth();
    const [classes, setClasses] = useState([]);
    useEffect(() => { api.get('/classes').then((r) => setClasses(r.data.data || [])).catch(() => { }); }, []);

    const quickActions = [
        { label: 'Mark Attendance', icon: ClipboardList, path: '/teacher/attendance', color: 'from-accent-500 to-accent-600' },
        { label: 'Enter Results', icon: FileText, path: '/teacher/results', color: 'from-purple-500 to-purple-600' },
        { label: 'Digital Library', icon: BookOpen, path: '/teacher/library', color: 'from-primary-500 to-primary-600' },
    ];

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="gradient-primary rounded-2xl p-6 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20"></div>
                <h1 className="text-2xl font-bold relative z-10">Good {new Date().getHours() < 12 ? 'Morning' : 'Afternoon'}, {user?.name?.split(' ')[0]}! 👋</h1>
                <p className="text-white/80 mt-1 relative z-10">Here's your teaching overview for today</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {quickActions.map((a) => (
                    <a key={a.label} href={a.path} className="bg-white rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-all border border-surface-100 flex items-center gap-4 group">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${a.color} flex items-center justify-center group-hover:scale-110 transition-transform`}><a.icon size={24} className="text-white" /></div>
                        <div><h3 className="font-semibold text-surface-900">{a.label}</h3><p className="text-xs text-surface-400">Click to open</p></div>
                    </a>
                ))}
            </div>

            <div className="bg-white rounded-2xl shadow-card border border-surface-100 p-6">
                <h2 className="font-semibold text-surface-900 mb-4">My Classes</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {classes.map((c) => (
                        <div key={c._id} className="p-4 bg-surface-50 rounded-xl flex items-center gap-3 hover:bg-surface-100 transition-colors">
                            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600 font-bold">{c.name.replace('Grade ', '')}</div>
                            <div><p className="font-medium text-surface-800 text-sm">{c.name}</p><p className="text-xs text-surface-400">Section {c.section} • {c.capacity} students</p></div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-card border border-surface-100 p-6">
                <h2 className="font-semibold text-surface-900 mb-4">Today's Schedule</h2>
                <div className="space-y-3">
                    {[{ time: '8:00 AM', sub: 'Mathematics', cls: 'Grade 10A' }, { time: '9:00 AM', sub: 'Physics', cls: 'Grade 11B' }, { time: '10:30 AM', sub: 'Mathematics', cls: 'Grade 9A' }, { time: '12:00 PM', sub: 'Physics Lab', cls: 'Grade 11B' }].map((s, i) => (
                        <div key={i} className="flex items-center gap-4 p-3 bg-surface-50 rounded-xl">
                            <span className="text-sm font-mono text-primary-600 w-20">{s.time}</span>
                            <div className="w-1 h-8 bg-primary-300 rounded-full"></div>
                            <div><p className="font-medium text-surface-800 text-sm">{s.sub}</p><p className="text-xs text-surface-400">{s.cls}</p></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
