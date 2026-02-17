import { useEffect, useState } from 'react';
import { Plus, X } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function ExamsPage() {
    const [exams, setExams] = useState([]);
    const [classes, setClasses] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ name: '', type: 'Internal', class: '', startDate: '', endDate: '', isPublished: false });

    const load = () => {
        api.get('/exams').then((r) => setExams(r.data.data || []));
        api.get('/classes').then((r) => setClasses(r.data.data || []));
    };
    useEffect(load, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/exams', form);
            toast.success('Exam created!');
            setShowForm(false);
            load();
        } catch (err) { toast.error('Error creating exam'); }
    }

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <div><h1 className="text-2xl font-bold text-surface-900">Examinations</h1><p className="text-surface-500 text-sm mt-1">Manage exams and schedules</p></div>
                <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-2.5 gradient-primary text-white rounded-xl text-sm font-medium hover:opacity-90 shadow-lg shadow-primary-500/25"><Plus size={18} /> Create Exam</button>
            </div>

            {showForm && (
                <div className="fixed inset-0 bg-surface-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl animate-scale-up">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-surface-900">New Examination</h2>
                            <button onClick={() => setShowForm(false)} className="p-2 hover:bg-surface-50 rounded-lg text-surface-400"><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div><label className="block text-sm font-medium text-surface-700 mb-1">Exam Name</label><input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Final Term Exam" className="w-full px-4 py-2 rounded-xl border border-surface-200 outline-none focus:ring-2 focus:ring-primary-500" /></div>
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="block text-sm font-medium text-surface-700 mb-1">Type</label><select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="w-full px-4 py-2 rounded-xl border border-surface-200 outline-none focus:ring-2 focus:ring-primary-500"><option>Internal</option><option>Terminal</option><option>Board</option></select></div>
                                <div><label className="block text-sm font-medium text-surface-700 mb-1">Class</label><select required value={form.class} onChange={e => setForm({ ...form, class: e.target.value })} className="w-full px-4 py-2 rounded-xl border border-surface-200 outline-none focus:ring-2 focus:ring-primary-500"><option value="">Select</option>{classes.map(c => <option key={c._id} value={c._id}>{c.name} {c.section}</option>)}</select></div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="block text-sm font-medium text-surface-700 mb-1">Start Date</label><input type="date" required value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} className="w-full px-4 py-2 rounded-xl border border-surface-200 outline-none focus:ring-2 focus:ring-primary-500" /></div>
                                <div><label className="block text-sm font-medium text-surface-700 mb-1">End Date</label><input type="date" required value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })} className="w-full px-4 py-2 rounded-xl border border-surface-200 outline-none focus:ring-2 focus:ring-primary-500" /></div>
                            </div>
                            <button type="submit" className="w-full py-3 gradient-primary text-white rounded-xl font-semibold shadow-lg shadow-primary-500/25 mt-2">Create Exam</button>
                        </form>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {exams.map((e) => (
                    <div key={e._id} className="bg-white rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-all border border-surface-100">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="font-semibold text-surface-900">{e.name}</h3>
                            <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${e.isPublished ? 'bg-accent-50 text-accent-700' : 'bg-amber-50 text-amber-700'}`}>{e.isPublished ? 'Published' : 'Draft'}</span>
                        </div>
                        <p className="text-sm text-surface-500 mb-2">{e.class?.name} {e.class?.section}</p>
                        <div className="flex justify-between text-xs text-surface-400">
                            <span>Type: {e.type}</span>
                            <span>{e.subjects?.length || 0} subjects</span>
                        </div>
                        {e.startDate && <p className="text-xs text-surface-400 mt-2">📅 {new Date(e.startDate).toLocaleDateString()} - {new Date(e.endDate).toLocaleDateString()}</p>}
                    </div>
                ))}
                {exams.length === 0 && <p className="text-surface-400 text-sm col-span-3 text-center py-10">No exams found.</p>}
            </div>
        </div>
    );
}
