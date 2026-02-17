import { useEffect, useState } from 'react';
import { Plus, Search, UserPlus, GraduationCap } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function StudentsPage() {
    const [students, setStudents] = useState([]);
    const [classes, setClasses] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [filter, setFilter] = useState('');
    const [form, setForm] = useState({ name: '', email: '', phone: '', class: '', section: 'A', rollNo: '', dateOfBirth: '', gender: 'Male', admissionNo: '' });

    const load = () => {
        api.get('/students').then((r) => setStudents(r.data.data || []));
        api.get('/classes').then((r) => setClasses(r.data.data || []));
    };
    useEffect(load, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/students', {
                ...form,
                guardian: {
                    fatherName: form.fatherName,
                    guardianName: form.guardianName || form.fatherName,
                    guardianPhone: form.guardianPhone || form.phone,
                    guardianEmail: form.email // Using student email as contact if not separate
                }
            });
            toast.success('Student admitted'); setShowForm(false); load();
        } catch (err) { toast.error(err.response?.data?.message || 'Error'); }
    };

    const filtered = students.filter((s) => s.user?.name?.toLowerCase().includes(filter.toLowerCase()) || s.admissionNo?.toLowerCase().includes(filter.toLowerCase()));

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div><h1 className="text-2xl font-bold text-surface-900">Student Management</h1><p className="text-surface-500 text-sm mt-1">{students.length} students enrolled</p></div>
                <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-4 py-2.5 gradient-primary text-white rounded-xl text-sm font-medium hover:opacity-90 shadow-lg shadow-primary-500/25"><UserPlus size={18} /> New Admission</button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-card border border-surface-100 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div><label className="block text-sm font-medium text-surface-700 mb-1">Full Name</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="w-full px-3 py-2 rounded-lg border border-surface-300 text-sm focus:ring-2 focus:ring-primary-500 outline-none" /></div>
                    <div><label className="block text-sm font-medium text-surface-700 mb-1">Email</label><input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required className="w-full px-3 py-2 rounded-lg border border-surface-300 text-sm focus:ring-2 focus:ring-primary-500 outline-none" /></div>
                    <div><label className="block text-sm font-medium text-surface-700 mb-1">Admission No</label><input value={form.admissionNo} onChange={(e) => setForm({ ...form, admissionNo: e.target.value })} required className="w-full px-3 py-2 rounded-lg border border-surface-300 text-sm focus:ring-2 focus:ring-primary-500 outline-none" /></div>
                    <div><label className="block text-sm font-medium text-surface-700 mb-1">Class</label><select value={form.class} onChange={(e) => setForm({ ...form, class: e.target.value })} required className="w-full px-3 py-2 rounded-lg border border-surface-300 text-sm focus:ring-2 focus:ring-primary-500 outline-none">
                        <option value="">Select</option>{classes.map((c) => <option key={c._id} value={c._id}>{c.name} - {c.section}</option>)}
                    </select></div>
                    <div><label className="block text-sm font-medium text-surface-700 mb-1">Roll No</label><input type="number" value={form.rollNo} onChange={(e) => setForm({ ...form, rollNo: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-surface-300 text-sm focus:ring-2 focus:ring-primary-500 outline-none" /></div>
                    <div><label className="block text-sm font-medium text-surface-700 mb-1">Phone</label><input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-surface-300 text-sm focus:ring-2 focus:ring-primary-500 outline-none" /></div>
                    <div><label className="block text-sm font-medium text-surface-700 mb-1">Father's Name</label><input value={form.fatherName} onChange={(e) => setForm({ ...form, fatherName: e.target.value })} required className="w-full px-3 py-2 rounded-lg border border-surface-300 text-sm focus:ring-2 focus:ring-primary-500 outline-none" /></div>
                    <div><label className="block text-sm font-medium text-surface-700 mb-1">Guardian Phone</label><input value={form.guardianPhone} onChange={(e) => setForm({ ...form, guardianPhone: e.target.value })} required className="w-full px-3 py-2 rounded-lg border border-surface-300 text-sm focus:ring-2 focus:ring-primary-500 outline-none" /></div>
                    <div><label className="block text-sm font-medium text-surface-700 mb-1">Gender</label><select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-surface-300 text-sm focus:ring-2 focus:ring-primary-500 outline-none">
                        <option>Male</option><option>Female</option><option>Other</option>
                    </select></div>
                    <div className="md:col-span-3 flex gap-2"><button type="submit" className="px-6 py-2 gradient-primary text-white rounded-lg text-sm font-medium">Admit Student</button><button type="button" onClick={() => setShowForm(false)} className="px-6 py-2 bg-surface-100 text-surface-600 rounded-lg text-sm">Cancel</button></div>
                </form>
            )}

            <div className="relative"><Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" /><input value={filter} onChange={(e) => setFilter(e.target.value)} placeholder="Search by name or admission no..." className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-surface-200 bg-white text-sm focus:ring-2 focus:ring-primary-400 outline-none" /></div>

            <div className="bg-white rounded-2xl shadow-card border border-surface-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full"><thead><tr className="bg-surface-50"><th className="px-6 py-3 text-left text-surface-500">Student</th><th className="px-6 py-3 text-left text-surface-500">Admission No</th><th className="px-6 py-3 text-left text-surface-500">Class</th><th className="px-6 py-3 text-left text-surface-500">Roll No</th><th className="px-6 py-3 text-left text-surface-500">Gender</th><th className="px-6 py-3 text-left text-surface-500">Status</th></tr></thead>
                        <tbody className="divide-y divide-surface-100">
                            {filtered.map((s) => (
                                <tr key={s._id} className="hover:bg-surface-50 transition-colors">
                                    <td className="px-6 py-4"><div className="flex items-center gap-3"><div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-semibold text-sm">{s.user?.name?.charAt(0)}</div><div><p className="font-medium text-surface-900 text-sm">{s.user?.name}</p><p className="text-xs text-surface-400">{s.user?.email}</p></div></div></td>
                                    <td className="px-6 py-4 text-sm font-mono text-surface-600">{s.admissionNo}</td>
                                    <td className="px-6 py-4"><span className="px-2.5 py-1 text-xs font-medium bg-primary-50 text-primary-700 rounded-full">{s.class?.name} {s.section}</span></td>
                                    <td className="px-6 py-4 text-sm text-surface-600">{s.rollNo}</td>
                                    <td className="px-6 py-4 text-sm text-surface-600">{s.gender}</td>
                                    <td className="px-6 py-4"><span className={`px-2.5 py-1 text-xs font-medium rounded-full ${s.status === 'active' ? 'bg-accent-50 text-accent-700' : 'bg-surface-100 text-surface-600'}`}>{s.status}</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
