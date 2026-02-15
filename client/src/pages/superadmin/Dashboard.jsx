import { useEffect, useState } from 'react';
import { School, Users, TrendingUp, Globe } from 'lucide-react';
import api from '../../services/api';

export default function SuperAdminDashboard() {
    const [schools, setSchools] = useState([]);
    useEffect(() => { api.get('/schools').then((r) => setSchools(r.data.data || [])).catch(() => { }); }, []);

    const stats = [
        { label: 'Total Schools', value: schools.length, icon: School, color: 'from-primary-500 to-primary-700', bg: 'bg-primary-50' },
        { label: 'Active Schools', value: schools.filter((s) => s.isActive).length, icon: TrendingUp, color: 'from-accent-500 to-accent-700', bg: 'bg-accent-50' },
        { label: 'Premium Plans', value: schools.filter((s) => s.subscription?.plan === 'premium').length, icon: Globe, color: 'from-purple-500 to-purple-700', bg: 'bg-purple-50' },
        { label: 'Total Capacity', value: `${schools.length * 500}+`, icon: Users, color: 'from-amber-500 to-amber-700', bg: 'bg-amber-50' },
    ];

    return (
        <div className="space-y-6 animate-fade-in">
            <div><h1 className="text-2xl font-bold text-surface-900">Super Admin Dashboard</h1><p className="text-surface-500 text-sm mt-1">Platform overview & school management</p></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((s) => (
                    <div key={s.label} className="bg-white rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-all duration-300 border border-surface-100">
                        <div className="flex items-center justify-between mb-3">
                            <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center`}><s.icon size={22} className="text-white" /></div>
                        </div>
                        <p className="text-2xl font-bold text-surface-900">{s.value}</p>
                        <p className="text-sm text-surface-500 mt-0.5">{s.label}</p>
                    </div>
                ))}
            </div>
            <div className="bg-white rounded-2xl shadow-card border border-surface-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-surface-100"><h2 className="font-semibold text-surface-900">Registered Schools</h2></div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead><tr className="bg-surface-50"><th className="px-6 py-3 text-left text-surface-500">School</th><th className="px-6 py-3 text-left text-surface-500">Code</th><th className="px-6 py-3 text-left text-surface-500">Board</th><th className="px-6 py-3 text-left text-surface-500">Plan</th><th className="px-6 py-3 text-left text-surface-500">Status</th></tr></thead>
                        <tbody className="divide-y divide-surface-100">
                            {schools.map((school) => (
                                <tr key={school._id} className="hover:bg-surface-50 transition-colors">
                                    <td className="px-6 py-4"><div><p className="font-medium text-surface-900">{school.name}</p><p className="text-xs text-surface-400">{school.address?.city}</p></div></td>
                                    <td className="px-6 py-4 text-sm font-mono text-surface-600">{school.code}</td>
                                    <td className="px-6 py-4"><span className="px-2.5 py-1 text-xs font-medium bg-primary-50 text-primary-700 rounded-full">{school.board}</span></td>
                                    <td className="px-6 py-4"><span className={`px-2.5 py-1 text-xs font-medium rounded-full ${school.subscription?.plan === 'premium' ? 'bg-purple-50 text-purple-700' : 'bg-surface-100 text-surface-600'}`}>{school.subscription?.plan}</span></td>
                                    <td className="px-6 py-4"><span className={`w-2 h-2 inline-block rounded-full mr-2 ${school.isActive ? 'bg-accent-500' : 'bg-red-500'}`}></span><span className="text-sm">{school.isActive ? 'Active' : 'Inactive'}</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
