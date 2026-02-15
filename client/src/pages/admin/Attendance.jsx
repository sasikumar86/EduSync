import { useEffect, useState } from 'react';
import { ClipboardList, CheckCircle, XCircle, Clock } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function AttendancePage() {
    const [classes, setClasses] = useState([]);
    const [students, setStudents] = useState([]);
    const [selectedClass, setSelectedClass] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [attendance, setAttendance] = useState({});
    const [existing, setExisting] = useState([]);

    useEffect(() => { api.get('/classes').then((r) => setClasses(r.data.data || [])); }, []);

    useEffect(() => {
        if (selectedClass) {
            api.get(`/students?class=${selectedClass}`).then((r) => {
                setStudents(r.data.data || []);
                const init = {};
                (r.data.data || []).forEach((s) => { init[s._id] = 'present'; });
                setAttendance(init);
            });
            api.get(`/attendance?class=${selectedClass}&date=${date}`).then((r) => setExisting(r.data.data || []));
        }
    }, [selectedClass, date]);

    const handleSubmit = async () => {
        const records = Object.entries(attendance).map(([student, status]) => ({ student, status }));
        try {
            await api.post('/attendance', { records, classId: selectedClass, date });
            toast.success('Attendance saved!');
        } catch (err) { toast.error('Error saving'); }
    };

    const statusIcon = { present: <CheckCircle size={18} className="text-accent-500" />, absent: <XCircle size={18} className="text-red-500" />, late: <Clock size={18} className="text-amber-500" /> };

    return (
        <div className="space-y-6 animate-fade-in">
            <div><h1 className="text-2xl font-bold text-surface-900">Attendance</h1><p className="text-surface-500 text-sm mt-1">Mark and view daily attendance</p></div>
            <div className="flex flex-wrap gap-3">
                <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} className="px-4 py-2.5 rounded-xl border border-surface-200 bg-white text-sm focus:ring-2 focus:ring-primary-400 outline-none">
                    <option value="">Select Class</option>
                    {classes.map((c) => <option key={c._id} value={c._id}>{c.name} - {c.section}</option>)}
                </select>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="px-4 py-2.5 rounded-xl border border-surface-200 bg-white text-sm focus:ring-2 focus:ring-primary-400 outline-none" />
                {students.length > 0 && <button onClick={handleSubmit} className="px-5 py-2.5 gradient-primary text-white rounded-xl text-sm font-medium hover:opacity-90 shadow-lg shadow-primary-500/25">Save Attendance</button>}
            </div>

            {students.length > 0 && (
                <div className="bg-white rounded-2xl shadow-card border border-surface-100 overflow-hidden">
                    <div className="overflow-x-auto"><table className="w-full"><thead><tr className="bg-surface-50"><th className="px-6 py-3 text-left text-surface-500 w-12">#</th><th className="px-6 py-3 text-left text-surface-500">Student</th><th className="px-6 py-3 text-left text-surface-500">Roll No</th><th className="px-6 py-3 text-center text-surface-500">Status</th></tr></thead>
                        <tbody className="divide-y divide-surface-100">
                            {students.map((s, i) => (
                                <tr key={s._id} className="hover:bg-surface-50 transition-colors">
                                    <td className="px-6 py-3 text-sm text-surface-400">{i + 1}</td>
                                    <td className="px-6 py-3"><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-semibold text-xs">{s.user?.name?.charAt(0)}</div><span className="text-sm font-medium text-surface-900">{s.user?.name}</span></div></td>
                                    <td className="px-6 py-3 text-sm text-surface-600">{s.rollNo}</td>
                                    <td className="px-6 py-3"><div className="flex items-center justify-center gap-2">
                                        {['present', 'absent', 'late'].map((status) => (
                                            <button key={status} onClick={() => setAttendance({ ...attendance, [s._id]: status })}
                                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${attendance[s._id] === status
                                                    ? status === 'present' ? 'bg-accent-100 text-accent-700 ring-2 ring-accent-300' : status === 'absent' ? 'bg-red-100 text-red-700 ring-2 ring-red-300' : 'bg-amber-100 text-amber-700 ring-2 ring-amber-300'
                                                    : 'bg-surface-100 text-surface-500 hover:bg-surface-200'}`}>{status.charAt(0).toUpperCase() + status.slice(1)}</button>
                                        ))}
                                    </div></td>
                                </tr>
                            ))}
                        </tbody>
                    </table></div>
                </div>
            )}
        </div>
    );
}
