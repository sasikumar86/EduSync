import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function ClassesPage() {
    const [classes, setClasses] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ name: '', section: 'A', capacity: 40 });
    const load = () => api.get('/classes').then((r) => setClasses(r.data.data || []));
    useEffect(load, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try { await api.post('/classes', form); toast.success('Class created'); setShowForm(false); load(); } catch (err) { toast.error(err.response?.data?.message || 'Error'); }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <div><h1 className="text-2xl font-bold text-surface-900">Classes</h1><p className="text-surface-500 text-sm mt-1">{classes.length} classes</p></div>
                <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-4 py-2.5 gradient-primary text-white rounded-xl text-sm font-medium hover:opacity-90 shadow-lg shadow-primary-500/25"><Plus size={18} /> Add Class</button>
            </div>
            {showForm && (
                <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-card border flex gap-4 items-end">
                    <div><label className="block text-sm font-medium text-surface-700 mb-1">Name</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Grade 1" required className="px-3 py-2 rounded-lg border border-surface-300 text-sm focus:ring-2 focus:ring-primary-500 outline-none" /></div>
                    <div><label className="block text-sm font-medium text-surface-700 mb-1">Section</label><input value={form.section} onChange={(e) => setForm({ ...form, section: e.target.value })} className="w-20 px-3 py-2 rounded-lg border border-surface-300 text-sm focus:ring-2 focus:ring-primary-500 outline-none" /></div>
                    <div><label className="block text-sm font-medium text-surface-700 mb-1">Capacity</label><input type="number" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} className="w-24 px-3 py-2 rounded-lg border border-surface-300 text-sm focus:ring-2 focus:ring-primary-500 outline-none" /></div>
                    <button type="submit" className="px-4 py-2 gradient-primary text-white rounded-lg text-sm font-medium">Create</button>
                </form>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {classes.map((c) => (
                    <div key={c._id} className="bg-white rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-all border border-surface-100">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center text-white font-bold">{c.name.replace('Grade ', '')}</div>
                            <div><h3 className="font-semibold text-surface-900">{c.name}</h3><p className="text-xs text-surface-400">Section {c.section}</p></div>
                        </div>
                        <div className="flex justify-between text-sm text-surface-500">
                            <span>Capacity: {c.capacity}</span>
                            <span className="text-xs bg-accent-50 text-accent-700 px-2 py-0.5 rounded-full">{c.academicYear}</span>
                        </div>
                        {c.classTeacher?.user && <p className="text-xs text-surface-400 mt-2">Teacher: {c.classTeacher.user.name}</p>}
                    </div>
                ))}
            </div>
        </div>
    );
}
