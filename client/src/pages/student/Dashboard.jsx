import { useEffect, useState } from 'react';
import { BookOpen, Award, ClipboardList, Calendar, Library, TrendingUp } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';

export default function StudentDashboard() {
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    useEffect(() => { api.get('/students/me/profile').then((r) => setProfile(r.data.data)).catch(() => { }); }, []);

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-accent-500 to-teal-500 rounded-2xl p-6 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-12 -mt-12"></div>
                <h1 className="text-2xl font-bold relative z-10">Welcome, {user?.name?.split(' ')[0]}! 🎓</h1>
                <p className="text-white/80 mt-1 relative z-10">
                    {profile ? `${profile.class?.name} • Section ${profile.section} • Roll No. ${profile.rollNo}` : 'Your student portal'}
                </p>
            </div>

            {/* Quick Info Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { icon: ClipboardList, label: 'Attendance', value: profile?.attendance || '95%', color: 'from-primary-500 to-primary-700' },
                    { icon: Award, label: 'GPA', value: profile?.gpa || '3.8', color: 'from-accent-500 to-accent-700' },
                    { icon: TrendingUp, label: 'Rank', value: profile?.rank || '#5', color: 'from-purple-500 to-purple-700' },
                    { icon: Library, label: 'Books Read', value: profile?.booksRead || '12', color: 'from-amber-500 to-amber-700' },
                ].map((s) => (
                    <div key={s.label} className="bg-white rounded-2xl p-4 shadow-card border border-surface-100 flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center`}><s.icon size={20} className="text-white" /></div>
                        <div><p className="text-lg font-bold text-surface-900">{s.value}</p><p className="text-xs text-surface-400">{s.label}</p></div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Today's Timetable */}
                <div className="bg-white rounded-2xl shadow-card border border-surface-100 p-6">
                    <h2 className="font-semibold text-surface-900 mb-4 flex items-center gap-2"><Calendar size={18} className="text-primary-500" /> Today's Timetable</h2>
                    <div className="space-y-2">
                        {[{ time: '8:00', sub: 'Mathematics', teacher: 'Mr. Patel' }, { time: '9:00', sub: 'English', teacher: 'Ms. Sharma' }, { time: '10:30', sub: 'Science', teacher: 'Dr. Kumar' }, { time: '12:00', sub: 'Hindi', teacher: 'Mrs. Gupta' }, { time: '2:00', sub: 'Computer Science', teacher: 'Mr. Rao' }].map((s, i) => (
                            <div key={i} className="flex items-center gap-3 p-3 bg-surface-50 rounded-xl hover:bg-surface-100 transition-colors">
                                <span className="text-xs font-mono text-primary-600 bg-primary-50 px-2 py-1 rounded-md w-14 text-center">{s.time}</span>
                                <div><p className="text-sm font-medium text-surface-800">{s.sub}</p><p className="text-xs text-surface-400">{s.teacher}</p></div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Results */}
                <div className="bg-white rounded-2xl shadow-card border border-surface-100 p-6">
                    <h2 className="font-semibold text-surface-900 mb-4 flex items-center gap-2"><Award size={18} className="text-accent-500" /> Recent Results</h2>
                    <div className="space-y-3">
                        {[{ sub: 'Mathematics', marks: '92/100', grade: 'A+' }, { sub: 'Science', marks: '88/100', grade: 'A' }, { sub: 'English', marks: '85/100', grade: 'A' }, { sub: 'Hindi', marks: '90/100', grade: 'A+' }].map((r, i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-surface-50 rounded-xl">
                                <div><p className="text-sm font-medium text-surface-800">{r.sub}</p><p className="text-xs text-surface-400">{r.marks}</p></div>
                                <span className="px-3 py-1 text-xs font-semibold bg-accent-50 text-accent-700 rounded-full">{r.grade}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Digital Library Quick Access */}
            <div className="bg-white rounded-2xl shadow-card border border-surface-100 p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="font-semibold text-surface-900 flex items-center gap-2"><BookOpen size={18} className="text-primary-500" /> Digital Library</h2>
                    <a href="/student/library" className="text-sm text-primary-600 hover:text-primary-700 font-medium">View All →</a>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {['Mathematics Textbook', 'Science Encyclopedia', 'English Grammar', 'Computer Science'].map((book) => (
                        <div key={book} className="p-4 bg-surface-50 rounded-xl text-center hover:bg-surface-100 transition-colors cursor-pointer">
                            <div className="w-12 h-16 bg-primary-100 rounded-lg mx-auto mb-2 flex items-center justify-center"><BookOpen size={20} className="text-primary-400" /></div>
                            <p className="text-xs font-medium text-surface-700 line-clamp-2">{book}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
