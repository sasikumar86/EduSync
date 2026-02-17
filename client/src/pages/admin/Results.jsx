import { useEffect, useState } from 'react';
import { Award, Search } from 'lucide-react';
import api from '../../services/api';

export default function ResultsPage() {
    const [results, setResults] = useState([]);
    const [filter, setFilter] = useState('');
    useEffect(() => { api.get('/results').then((r) => setResults(r.data.data || [])); }, []);

    const filtered = results.filter(r =>
        r.student?.user?.name?.toLowerCase().includes(filter.toLowerCase()) ||
        r.exam?.name?.toLowerCase().includes(filter.toLowerCase())
    );

    const gradeColor = (g) => {
        if (g === 'A+' || g === 'A') return 'bg-accent-50 text-accent-700';
        if (g === 'B+' || g === 'B') return 'bg-primary-50 text-primary-700';
        if (g === 'C+' || g === 'C') return 'bg-amber-50 text-amber-700';
        return 'bg-red-50 text-red-700';
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div><h1 className="text-2xl font-bold text-surface-900">Results & Reports</h1><p className="text-surface-500 text-sm mt-1">{results.length} result records</p></div>

            <div className="relative"><Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" /><input value={filter} onChange={(e) => setFilter(e.target.value)} placeholder="Search student or exam..." className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-surface-200 bg-white text-sm focus:ring-2 focus:ring-primary-400 outline-none" /></div>

            <div className="bg-white rounded-2xl shadow-card border border-surface-100 overflow-hidden">
                <div className="overflow-x-auto"><table className="w-full"><thead><tr className="bg-surface-50"><th className="px-6 py-3 text-left text-surface-500">Student</th><th className="px-6 py-3 text-left text-surface-500">Exam</th><th className="px-6 py-3 text-center text-surface-500">Marks</th><th className="px-6 py-3 text-center text-surface-500">Percentage</th><th className="px-6 py-3 text-center text-surface-500">GPA</th><th className="px-6 py-3 text-center text-surface-500">Grade</th></tr></thead>
                    <tbody className="divide-y divide-surface-100">
                        {filtered.map((r) => (
                            <tr key={r._id} className="hover:bg-surface-50 transition-colors">
                                <td className="px-6 py-4"><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-semibold text-xs">{r.student?.user?.name?.charAt(0)}</div><span className="text-sm font-medium text-surface-900">{r.student?.user?.name}</span></div></td>
                                <td className="px-6 py-4 text-sm text-surface-600">{r.exam?.name}</td>
                                <td className="px-6 py-4 text-center text-sm font-medium text-surface-900">{r.totalMarks}/{r.totalMaxMarks}</td>
                                <td className="px-6 py-4 text-center"><span className="text-sm font-semibold text-surface-900">{r.percentage}%</span></td>
                                <td className="px-6 py-4 text-center"><span className="text-sm font-bold text-primary-600">{r.gpa}</span></td>
                                <td className="px-6 py-4 text-center"><span className={`px-3 py-1 text-xs font-semibold rounded-full ${gradeColor(r.overallGrade)}`}>{r.overallGrade}</span></td>
                            </tr>
                        ))}
                    </tbody>
                </table></div>
            </div>
        </div>
    );
}
