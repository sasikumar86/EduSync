import { useEffect, useState } from 'react';
import { DollarSign, CreditCard, CheckCircle, Plus, X } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function FeesPage() {
    const [structures, setStructures] = useState([]);
    const [payments, setPayments] = useState([]);
    const [students, setStudents] = useState([]);
    const [tab, setTab] = useState('structures');
    const [showPayForm, setShowPayForm] = useState(false);
    const [form, setForm] = useState({ student: '', amount: '', method: 'Cash', date: new Date().toISOString().split('T')[0] });

    const load = () => {
        api.get('/fees/structures').then((r) => setStructures(r.data.data || []));
        api.get('/fees/payments').then((r) => setPayments(r.data.data || []));
        api.get('/students').then((r) => setStudents(r.data.data || []));
    };
    useEffect(load, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/fees/payments', form);
            toast.success('Payment recorded'); setShowPayForm(false); load();
        } catch (err) { toast.error('Error recording payment'); }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <div><h1 className="text-2xl font-bold text-surface-900">Financial Management</h1><p className="text-surface-500 text-sm mt-1">Fee structures & payment records</p></div>
                <button onClick={() => setShowPayForm(true)} className="flex items-center gap-2 px-4 py-2.5 gradient-primary text-white rounded-xl text-sm font-medium hover:opacity-90 shadow-lg shadow-primary-500/25"><Plus size={18} /> Collect Fee</button>
            </div>

            {showPayForm && (
                <div className="fixed inset-0 bg-surface-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl animate-scale-up">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-surface-900">Record Payment</h2>
                            <button onClick={() => setShowPayForm(false)} className="p-2 hover:bg-surface-50 rounded-lg text-surface-400"><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div><label className="block text-sm font-medium text-surface-700 mb-1">Student</label><select required value={form.student} onChange={e => setForm({ ...form, student: e.target.value })} className="w-full px-4 py-2 rounded-xl border border-surface-200 outline-none focus:ring-2 focus:ring-primary-500"><option value="">Select Student</option>{students.map(s => <option key={s._id} value={s._id}>{s.user?.name} ({s.class?.name})</option>)}</select></div>
                            <div><label className="block text-sm font-medium text-surface-700 mb-1">Amount (₹)</label><input type="number" required value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} className="w-full px-4 py-2 rounded-xl border border-surface-200 outline-none focus:ring-2 focus:ring-primary-500" /></div>
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="block text-sm font-medium text-surface-700 mb-1">Method</label><select value={form.method} onChange={e => setForm({ ...form, method: e.target.value })} className="w-full px-4 py-2 rounded-xl border border-surface-200 outline-none focus:ring-2 focus:ring-primary-500"><option>Cash</option><option>Online</option><option>Bank Transfer</option><option>Cheque</option></select></div>
                                <div><label className="block text-sm font-medium text-surface-700 mb-1">Date</label><input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="w-full px-4 py-2 rounded-xl border border-surface-200 outline-none focus:ring-2 focus:ring-primary-500" /></div>
                            </div>
                            <button type="submit" className="w-full py-3 gradient-primary text-white rounded-xl font-semibold shadow-lg shadow-primary-500/25 mt-2 transition-transform active:scale-95">Record Payment</button>
                        </form>
                    </div>
                </div>
            )}

            <div className="flex gap-2">
                {['structures', 'payments'].map((t) => (
                    <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${tab === t ? 'gradient-primary text-white shadow-lg shadow-primary-500/25' : 'bg-white text-surface-600 border border-surface-200 hover:bg-surface-50'}`}>{t === 'structures' ? 'Fee Structures' : 'Payments'}</button>
                ))}
            </div>
            {tab === 'structures' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {structures.map((s) => (
                        <div key={s._id} className="bg-white rounded-2xl p-5 shadow-card border border-surface-100 group hover:border-primary-200 transition-colors">
                            <div className="flex items-center gap-3 mb-3"><div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-700 flex items-center justify-center group-hover:scale-110 transition-transform"><DollarSign size={20} className="text-white" /></div><div><h3 className="font-semibold text-surface-900 text-sm">{s.name}</h3><p className="text-xs text-surface-400">{s.class?.name}</p></div></div>
                            <div className="space-y-1.5 mb-3">{s.components?.map((c, i) => (<div key={i} className="flex justify-between text-sm"><span className="text-surface-500">{c.name}</span><span className="text-surface-700 font-medium">₹{c.amount?.toLocaleString()}</span></div>))}</div>
                            <div className="pt-3 border-t border-surface-100 flex justify-between"><span className="text-sm font-semibold text-surface-900">Total</span><span className="text-lg font-bold text-primary-600">₹{s.totalAmount?.toLocaleString()}</span></div>
                        </div>
                    ))}
                    {structures.length === 0 && <p className="text-surface-400 text-sm col-span-3 text-center py-10">No fee structures defined.</p>}
                </div>
            ) : (
                <div className="bg-white rounded-2xl shadow-card border border-surface-100 overflow-hidden">
                    <div className="overflow-x-auto"><table className="w-full"><thead><tr className="bg-surface-50"><th className="px-6 py-3 text-left text-surface-500">Student</th><th className="px-6 py-3 text-left text-surface-500">Amount</th><th className="px-6 py-3 text-left text-surface-500">Method</th><th className="px-6 py-3 text-left text-surface-500">Date</th><th className="px-6 py-3 text-left text-surface-500">Status</th></tr></thead>
                        <tbody className="divide-y divide-surface-100">{payments.map((p) => (
                            <tr key={p._id} className="hover:bg-surface-50 transition-colors">
                                <td className="px-6 py-4 text-sm font-medium text-surface-900">{p.student?.user?.name || 'Unknown Student'}</td>
                                <td className="px-6 py-4 text-sm font-semibold text-accent-600">₹{p.amount?.toLocaleString()}</td>
                                <td className="px-6 py-4"><span className="px-2.5 py-1 text-xs font-medium bg-surface-100 text-surface-600 rounded-full">{p.method}</span></td>
                                <td className="px-6 py-4 text-sm text-surface-500">{new Date(p.date).toLocaleDateString()}</td>
                                <td className="px-6 py-4"><span className={`flex items-center gap-1 text-xs font-medium ${p.status === 'paid' ? 'text-accent-600' : 'text-amber-600'}`}><CheckCircle size={14} />{p.status}</span></td>
                            </tr>
                        ))}
                            {payments.length === 0 && <tr><td colSpan="5" className="px-6 py-10 text-center text-sm text-surface-400">No payment records found.</td></tr>}
                        </tbody>
                    </table></div>
                </div>
            )}
        </div>
    );
}
