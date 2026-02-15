import { useEffect, useState } from 'react';
import { Plus, Search } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function StaffPage() {
    const [staff, setStaff] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ name: '', email: '', phone: '', employeeId: '', department: '', designation: '', role: 'teacher' });
    const load = () => api.get('/staff').then((r) => setStaff(r.data.data || []));
    useEffect(load, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/staff', form);
            toast.success('Staff added'); setShowForm(false); load();
        } catch (err) { toast.error(err.response?.data?.message || 'Error'); }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <div><h1 className="text-2xl font-bold text-surface-900">Staff Management</h1><p className="text-surface-500 text-sm mt-1">{staff.length} staff members</p></div>
                <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-4 py-2.5 gradient-primary text-white rounded-xl text-sm font-medium hover:opacity-90 shadow-lg shadow-primary-500/25"><Plus size={18} /> Add Staff</button>
            </div>
            {showForm && (
                <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-card border border-surface-100 grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[['name', 'Name'], ['email', 'Email'], ['phone', 'Phone'], ['employeeId', 'Employee ID'], ['department', 'Department'], ['designation', 'Designation']].map(([k, l]) => (
                        <div key={k}><label className="block text-sm font-medium text-surface-700 mb-1">{l}</label><input value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} required className="w-full px-3 py-2 rounded-lg border border-surface-300 text-sm focus:ring-2 focus:ring-primary-500 outline-none" /></div>
                    ))}
                    <div className="md:col-span-3 flex gap-2"><button type="submit" className="px-6 py-2 gradient-primary text-white rounded-lg text-sm font-medium">Add Staff</button><button type="button" onClick={() => setShowForm(false)} className="px-6 py-2 bg-surface-100 text-surface-600 rounded-lg text-sm">Cancel</button></div>
                </form>
            )}
            <div className="bg-white rounded-2xl shadow-card border border-surface-100 overflow-hidden">
                <div className="overflow-x-auto"><table className="w-full"><thead><tr className="bg-surface-50"><th className="px-6 py-3 text-left text-surface-500">Staff</th><th className="px-6 py-3 text-left text-surface-500">Employee ID</th><th className="px-6 py-3 text-left text-surface-500">Department</th><th className="px-6 py-3 text-left text-surface-500">Designation</th><th className="px-6 py-3 text-left text-surface-500">Status</th></tr></thead>
                    <tbody className="divide-y divide-surface-100">
                        {staff.map((s) => (
                            <tr key={s._id} className="hover:bg-surface-50 transition-colors">
                                <td className="px-6 py-4"><div className="flex items-center gap-3"><div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 font-semibold text-sm">{s.user?.name?.charAt(0)}</div><div><p className="font-medium text-surface-900 text-sm">{s.user?.name}</p><p className="text-xs text-surface-400">{s.user?.email}</p></div></div></td>
                                <td className="px-6 py-4 text-sm font-mono text-surface-600">{s.employeeId}</td>
                                <td className="px-6 py-4 text-sm text-surface-600">{s.department}</td>
                                <td className="px-6 py-4 text-sm text-surface-600">{s.designation}</td>
                                <td className="px-6 py-4"><span className={`px-2.5 py-1 text-xs font-medium rounded-full ${s.status === 'active' ? 'bg-accent-50 text-accent-700' : 'bg-red-50 text-red-600'}`}>{s.status}</span></td>
                            </tr>
                        ))}
                    </tbody>
                </table></div>
            </div>
        </div>
    );
}
