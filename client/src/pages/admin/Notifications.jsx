import { useEffect, useState } from 'react';
import { Bell, Plus, Send } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ title: '', message: '', type: 'general', targetAudience: 'all' });
    const load = () => api.get('/notifications').then((r) => setNotifications(r.data.data || []));
    useEffect(load, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try { await api.post('/notifications', form); toast.success('Notification sent!'); setShowForm(false); load(); }
        catch (err) { toast.error(err.response?.data?.message || 'Error'); }
    };

    const typeColor = { general: 'bg-primary-50 text-primary-700', academic: 'bg-purple-50 text-purple-700', fee: 'bg-amber-50 text-amber-700', event: 'bg-accent-50 text-accent-700', emergency: 'bg-red-50 text-red-700' };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <div><h1 className="text-2xl font-bold text-surface-900">Notifications</h1><p className="text-surface-500 text-sm mt-1">{notifications.length} notifications</p></div>
                <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-4 py-2.5 gradient-primary text-white rounded-xl text-sm font-medium hover:opacity-90 shadow-lg shadow-primary-500/25"><Send size={18} /> Send Notification</button>
            </div>
            {showForm && (
                <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-card border border-surface-100 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div><label className="block text-sm font-medium text-surface-700 mb-1">Title</label><input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required className="w-full px-3 py-2 rounded-lg border border-surface-300 text-sm focus:ring-2 focus:ring-primary-500 outline-none" /></div>
                        <div className="flex gap-4">
                            <div className="flex-1"><label className="block text-sm font-medium text-surface-700 mb-1">Type</label><select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-surface-300 text-sm focus:ring-2 focus:ring-primary-500 outline-none">{['general', 'academic', 'fee', 'event', 'emergency'].map((t) => <option key={t}>{t}</option>)}</select></div>
                            <div className="flex-1"><label className="block text-sm font-medium text-surface-700 mb-1">Audience</label><select value={form.targetAudience} onChange={(e) => setForm({ ...form, targetAudience: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-surface-300 text-sm focus:ring-2 focus:ring-primary-500 outline-none">{['all', 'students', 'parents', 'teachers', 'staff'].map((a) => <option key={a}>{a}</option>)}</select></div>
                        </div>
                    </div>
                    <div><label className="block text-sm font-medium text-surface-700 mb-1">Message</label><textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={3} required className="w-full px-3 py-2 rounded-lg border border-surface-300 text-sm focus:ring-2 focus:ring-primary-500 outline-none resize-none" /></div>
                    <div className="flex gap-2"><button type="submit" className="px-6 py-2 gradient-primary text-white rounded-lg text-sm font-medium">Send</button><button type="button" onClick={() => setShowForm(false)} className="px-6 py-2 bg-surface-100 text-surface-600 rounded-lg text-sm">Cancel</button></div>
                </form>
            )}
            <div className="space-y-3">
                {notifications.map((n) => (
                    <div key={n._id} className="bg-white rounded-2xl p-5 shadow-card border border-surface-100 hover:shadow-card-hover transition-all">
                        <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center mt-0.5"><Bell size={18} className="text-primary-600" /></div>
                                <div><h3 className="font-semibold text-surface-900">{n.title}</h3><p className="text-sm text-surface-500 mt-1">{n.message}</p><p className="text-xs text-surface-400 mt-2">{new Date(n.createdAt).toLocaleString()}</p></div>
                            </div>
                            <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${typeColor[n.type] || typeColor.general}`}>{n.type}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
