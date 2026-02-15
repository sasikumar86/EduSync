import { useEffect, useState } from 'react';
import { BookOpen, Search, Eye } from 'lucide-react';
import api from '../../services/api';

export default function LibraryPage() {
    const [books, setBooks] = useState([]);
    const [filter, setFilter] = useState('');
    const [reading, setReading] = useState(null);
    useEffect(() => { api.get('/library').then((r) => setBooks(r.data.data || [])); }, []);

    const filtered = books.filter((b) => b.title?.toLowerCase().includes(filter.toLowerCase()) || b.author?.toLowerCase().includes(filter.toLowerCase()));

    return (
        <div className="space-y-6 animate-fade-in">
            <div><h1 className="text-2xl font-bold text-surface-900">Digital Library</h1><p className="text-surface-500 text-sm mt-1">{books.length} books available</p></div>

            <div className="relative"><Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" /><input value={filter} onChange={(e) => setFilter(e.target.value)} placeholder="Search books by title or author..." className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-surface-200 bg-white text-sm focus:ring-2 focus:ring-primary-400 outline-none" /></div>

            {reading && (
                <div className="bg-white rounded-2xl shadow-glass border border-surface-100 p-8 animate-fade-in">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-surface-900">{reading.title}</h2>
                        <button onClick={() => setReading(null)} className="px-3 py-1 text-sm bg-surface-100 rounded-lg hover:bg-surface-200">Close</button>
                    </div>
                    <p className="text-sm text-surface-500 mb-3">by {reading.author} • {reading.category}</p>
                    <div className="prose max-w-none text-surface-700 leading-relaxed">
                        <p>{reading.description || 'This digital book is available for reading. In a production system, the full content would load here with pagination, bookmarking, and progress tracking features.'}</p>
                        <div className="mt-6 p-6 bg-surface-50 rounded-xl text-center">
                            <BookOpen size={48} className="mx-auto text-primary-300 mb-3" />
                            <p className="text-surface-400 text-sm">Digital reader would load here with the full book content.</p>
                            <p className="text-xs text-surface-300 mt-1">Supporting PDF, EPUB, and HTML formats</p>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filtered.map((book) => (
                    <div key={book._id} className="bg-white rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-all border border-surface-100 group">
                        <div className="w-full h-40 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl mb-4 flex items-center justify-center group-hover:scale-[1.02] transition-transform">
                            <BookOpen size={40} className="text-primary-400" />
                        </div>
                        <h3 className="font-semibold text-surface-900 text-sm line-clamp-1">{book.title}</h3>
                        <p className="text-xs text-surface-400 mt-0.5">{book.author}</p>
                        <div className="flex items-center justify-between mt-3">
                            <span className="px-2 py-0.5 text-xs font-medium bg-primary-50 text-primary-700 rounded-full">{book.category}</span>
                            <span className={`text-xs font-medium ${book.availableCopies > 0 ? 'text-accent-600' : 'text-red-500'}`}>{book.isDigital ? 'Digital' : `${book.availableCopies} avail`}</span>
                        </div>
                        {book.isDigital && (
                            <button onClick={() => setReading(book)} className="w-full mt-3 flex items-center justify-center gap-1.5 py-2 bg-primary-50 text-primary-600 rounded-lg text-xs font-medium hover:bg-primary-100 transition-colors"><Eye size={14} /> Read Now</button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
