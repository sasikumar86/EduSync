import { useEffect, useState } from 'react';
import api from '../../services/api';

export default function ExamsPage() {
    const [exams, setExams] = useState([]);
    useEffect(() => { api.get('/exams').then((r) => setExams(r.data.data || [])); }, []);

    return (
        <div className="space-y-6 animate-fade-in">
            <div><h1 className="text-2xl font-bold text-surface-900">Examinations</h1><p className="text-surface-500 text-sm mt-1">Manage exams and schedules</p></div>
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
                {exams.length === 0 && <p className="text-surface-400 text-sm col-span-3">No exams found.</p>}
            </div>
        </div>
    );
}
