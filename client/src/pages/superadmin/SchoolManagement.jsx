import { useEffect, useState } from 'react';
import { Plus, School, Edit, Trash2 } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function SchoolManagement() {
    const [schools, setSchools] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ name: '', code: '', phone: '', email: '', board: 'CBSE', principal: '' });

    const load = () => api.get('/schools').then((r) => setSchools(r.data.data || []));
    useEffect(() => { load(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/schools', { ...form, address: { city: 'City' } });
            toast.success('School created');
            setShowForm(false);
            setForm({ name: '', code: '', phone: '', email: '', board: 'CBSE', principal: '' });
            load();
        } catch (err) { toast.error(err.response?.data?.message || 'Error'); }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <div><h1 className="text-2xl font-bold text-surface-900">School Management</h1><p className="text-sm text-surface-500 mt-1">Manage registered schools</p></div>
                <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-4 py-2.5 gradient-primary text-white rounded-xl text-sm font-medium hover:opacity-90 shadow-lg shadow-primary-500/25"><Plus size={18} /> Add School</button>
            </div>
            {showForm && (
                <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-card border border-surface-100 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[['name', 'School Name'], ['code', 'Code'], ['phone', 'Phone'], ['email', 'Email'], ['principal', 'Principal']].map(([key, label]) => (
                        <div key={key}><label className="block text-sm font-medium text-surface-700 mb-1">{label}</label>
                            <input value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} required className="w-full px-3 py-2 rounded-lg border border-surface-300 text-sm focus:ring-2 focus:ring-primary-500 outline-none" /></div>
                    ))}
                    <div><label className="block text-sm font-medium text-surface-700 mb-1">Board</label>
                        <select value={form.board} onChange={(e) => setForm({ ...form, board: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-surface-300 text-sm focus:ring-2 focus:ring-primary-500 outline-none">
                            {['CBSE', 'ICSE', 'State', 'IB', 'IGCSE'].map((b) => <option key={b}>{b}</option>)}
                        </select></div>
                    <div className="md:col-span-2 flex gap-2"><button type="submit" className="px-6 py-2 gradient-primary text-white rounded-lg text-sm font-medium">Create</button><button type="button" onClick={() => setShowForm(false)} className="px-6 py-2 bg-surface-100 text-surface-600 rounded-lg text-sm">Cancel</button></div>
                </form>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {schools.map((school) => (
                    <div key={school._id} className="bg-white rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-all border border-surface-100">
                        <div className="flex items-start gap-3 mb-3">
                            <div className="w-11 h-11 gradient-primary rounded-xl flex items-center justify-center"><School size={22} className="text-white" /></div>
                            <div className="flex-1"><h3 className="font-semibold text-surface-900">{school.name}</h3><p className="text-xs text-surface-400">{school.code} • {school.board}</p></div>
                        </div>
                        <div className="space-y-1 text-sm text-surface-600">
                            <p>📞 {school.phone}</p><p>✉️ {school.email}</p><p>👤 {school.principal}</p>
                        </div>
                        <div className="mt-3 pt-3 border-t border-surface-100 flex items-center justify-between">
                            <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${school.subscription?.plan === 'premium' ? 'bg-purple-50 text-purple-700' : 'bg-surface-100 text-surface-600'}`}>{school.subscription?.plan || 'free'}</span>
                            <span className={`flex items-center gap-1 text-xs ${school.isActive ? 'text-accent-600' : 'text-red-500'}`}><span className={`w-1.5 h-1.5 rounded-full ${school.isActive ? 'bg-accent-500' : 'bg-red-500'}`}></span>{school.isActive ? 'Active' : 'Inactive'}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
