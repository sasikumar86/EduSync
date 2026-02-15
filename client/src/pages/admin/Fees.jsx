import { useEffect, useState } from 'react';
import { DollarSign, CreditCard, CheckCircle } from 'lucide-react';
import api from '../../services/api';

export default function FeesPage() {
    const [structures, setStructures] = useState([]);
    const [payments, setPayments] = useState([]);
    const [tab, setTab] = useState('structures');
    useEffect(() => {
        api.get('/fees/structures').then((r) => setStructures(r.data.data || []));
        api.get('/fees/payments').then((r) => setPayments(r.data.data || []));
    }, []);

    return (
        <div className="space-y-6 animate-fade-in">
            <div><h1 className="text-2xl font-bold text-surface-900">Financial Management</h1><p className="text-surface-500 text-sm mt-1">Fee structures & payment records</p></div>
            <div className="flex gap-2">
                {['structures', 'payments'].map((t) => (
                    <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${tab === t ? 'gradient-primary text-white shadow-lg shadow-primary-500/25' : 'bg-white text-surface-600 border border-surface-200 hover:bg-surface-50'}`}>{t === 'structures' ? 'Fee Structures' : 'Payments'}</button>
                ))}
            </div>
            {tab === 'structures' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {structures.map((s) => (
                        <div key={s._id} className="bg-white rounded-2xl p-5 shadow-card border border-surface-100">
                            <div className="flex items-center gap-3 mb-3"><div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-700 flex items-center justify-center"><DollarSign size={20} className="text-white" /></div><div><h3 className="font-semibold text-surface-900 text-sm">{s.name}</h3><p className="text-xs text-surface-400">{s.class?.name}</p></div></div>
                            <div className="space-y-1.5 mb-3">{s.components?.map((c, i) => (<div key={i} className="flex justify-between text-sm"><span className="text-surface-500">{c.name}</span><span className="text-surface-700 font-medium">₹{c.amount?.toLocaleString()}</span></div>))}</div>
                            <div className="pt-3 border-t border-surface-100 flex justify-between"><span className="text-sm font-semibold text-surface-900">Total</span><span className="text-lg font-bold text-primary-600">₹{s.totalAmount?.toLocaleString()}</span></div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-2xl shadow-card border border-surface-100 overflow-hidden">
                    <div className="overflow-x-auto"><table className="w-full"><thead><tr className="bg-surface-50"><th className="px-6 py-3 text-left text-surface-500">Student</th><th className="px-6 py-3 text-left text-surface-500">Amount</th><th className="px-6 py-3 text-left text-surface-500">Method</th><th className="px-6 py-3 text-left text-surface-500">Date</th><th className="px-6 py-3 text-left text-surface-500">Status</th></tr></thead>
                        <tbody className="divide-y divide-surface-100">{payments.map((p) => (
                            <tr key={p._id} className="hover:bg-surface-50 transition-colors">
                                <td className="px-6 py-4 text-sm font-medium text-surface-900">{p.student?.user?.name}</td>
                                <td className="px-6 py-4 text-sm font-semibold text-accent-600">₹{p.amount?.toLocaleString()}</td>
                                <td className="px-6 py-4"><span className="px-2.5 py-1 text-xs font-medium bg-surface-100 text-surface-600 rounded-full">{p.method}</span></td>
                                <td className="px-6 py-4 text-sm text-surface-500">{new Date(p.date).toLocaleDateString()}</td>
                                <td className="px-6 py-4"><span className={`flex items-center gap-1 text-xs font-medium ${p.status === 'paid' ? 'text-accent-600' : 'text-amber-600'}`}><CheckCircle size={14} />{p.status}</span></td>
                            </tr>
                        ))}</tbody>
                    </table></div>
                </div>
            )}
        </div>
    );
}
