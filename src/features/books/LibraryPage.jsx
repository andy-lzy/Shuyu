import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getBooks, getBooksByStatus } from '../../services/bookService';
import { BookOpen, Plus, Search, Loader2 } from 'lucide-react';

export default function LibraryPage() {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('all'); // all, toread, reading, finished
    const { t } = useTranslation();

    useEffect(() => {
        loadBooks();
    }, [filter]);

    async function loadBooks() {
        try {
            setLoading(true);
            let data;
            if (filter === 'all') {
                data = await getBooks();
            } else {
                data = await getBooksByStatus(filter);
            }
            setBooks(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="pb-24 pt-8 px-6">
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">{t('library.title')}</h1>
                    <p className="text-slate-500 mt-1">{t('library.subtitle')}</p>
                </div>
                <Link to="/add" className="p-3 bg-slate-900 text-white rounded-full shadow-lg shadow-slate-900/20 hover:scale-105 transition-transform">
                    <Plus size={24} />
                </Link>
            </header>

            {/* Filter Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-4 mb-4 no-scrollbar">
                {['all', 'toread', 'reading', 'finished'].map((status) => (
                    <button
                        key={status}
                        onClick={() => setFilter(status)}
                        className={`px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all ${filter === status
                                ? 'bg-slate-900 text-white shadow-md'
                                : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
                            }`}
                    >
                        {t(`library.tabs.${status}`)}
                    </button>
                ))}
            </div>

            {/* Search Bar Placeholder */}
            <div className="relative mb-8">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                    type="text"
                    placeholder={t('library.search')}
                    className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all"
                />
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="animate-spin text-slate-400" size={32} />
                </div>
            ) : error ? (
                <div className="p-4 bg-rose-50 text-rose-600 rounded-xl border border-rose-100">
                    {error}
                </div>
            ) : books.length === 0 ? (
                <div className="text-center py-12">
                    <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                        <BookOpen size={32} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 mb-2">{t('library.empty')}</h3>
                    <Link to="/add" className="text-primary font-bold hover:underline">
                        {t('library.addFirst')}
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-4">
                    {books.map((book) => (
                        <Link key={book.id} to={`/library/${book.id}`} className="group">
                            <div className="aspect-[2/3] bg-slate-200 rounded-xl overflow-hidden mb-3 shadow-sm group-hover:shadow-md transition-all relative">
                                {book.cover_url ? (
                                    <img src={book.cover_url} alt={book.title} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-300">
                                        <BookOpen size={32} />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                            </div>
                            <h3 className="font-bold text-slate-800 leading-tight mb-1 line-clamp-2">{book.title}</h3>
                            <p className="text-sm text-slate-500 line-clamp-1">{book.author}</p>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
