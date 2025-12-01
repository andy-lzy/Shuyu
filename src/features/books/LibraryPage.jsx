import { useState, useEffect } from 'react';
import { Search, Filter, BookOpen, CheckCircle, Clock, Loader2 } from 'lucide-react';
import { getBooks, searchBooks } from '../../services/bookService';

export default function LibraryPage() {
    const [filter, setFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch books on mount
    useEffect(() => {
        loadBooks();
    }, []);

    const loadBooks = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getBooks();
            setBooks(data);
        } catch (err) {
            console.error('Error loading books:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Handle search
    const handleSearch = async (query) => {
        setSearchQuery(query);
        if (!query.trim()) {
            loadBooks();
            return;
        }

        try {
            setLoading(true);
            const data = await searchBooks(query);
            setBooks(data);
        } catch (err) {
            console.error('Error searching books:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Filter books by status
    const filteredBooks = filter === 'all'
        ? books
        : books.filter(book => book.status === filter);

    // Calculate progress percentage
    const getProgress = (book) => {
        if (!book.total_pages || book.total_pages === 0) return 0;
        return Math.round((book.current_page / book.total_pages) * 100);
    };

    return (
        <div className="pb-24 pt-8 px-6">
            <header className="mb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600">
                        My Library
                    </h1>
                    <p className="text-muted mt-1">
                        {loading ? 'Loading...' : `${books.length} book${books.length !== 1 ? 's' : ''} collected`}
                    </p>
                </div>
            </header>

            {/* Search Bar */}
            <div className="relative mb-8">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                <input
                    type="text"
                    placeholder="Search your books..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                />
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-3 mb-8 overflow-x-auto pb-2 scrollbar-hide">
                {['all', 'reading', 'finished', 'toread'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setFilter(tab)}
                        className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${filter === tab
                                ? 'bg-slate-800 text-white shadow-md'
                                : 'bg-white text-slate-600 border border-slate-200'
                            }`}
                    >
                        {tab === 'toread' ? 'To Read' : tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                ))}
            </div>

            {/* Loading State */}
            {loading && (
                <div className="flex justify-center items-center py-20">
                    <Loader2 className="animate-spin text-primary" size={32} />
                </div>
            )}

            {/* Error State */}
            {error && (
                <div className="bg-rose-50 text-rose-600 p-4 rounded-xl text-sm border border-rose-100">
                    Error loading books: {error}
                </div>
            )}

            {/* Empty State */}
            {!loading && !error && filteredBooks.length === 0 && (
                <div className="text-center py-20">
                    <BookOpen className="mx-auto mb-4 text-slate-300" size={48} />
                    <h3 className="text-lg font-semibold text-slate-600 mb-2">No books yet</h3>
                    <p className="text-slate-400 text-sm">
                        {searchQuery ? 'No books match your search' : 'Start adding books to your library!'}
                    </p>
                </div>
            )}

            {/* Books Grid */}
            {!loading && !error && filteredBooks.length > 0 && (
                <div className="grid grid-cols-2 gap-4">
                    {filteredBooks.map((book) => {
                        const progress = getProgress(book);
                        return (
                            <div key={book.id} className="card p-0 overflow-hidden group relative">
                                {/* Cover Image */}
                                <div className="aspect-[2/3] bg-slate-200 relative overflow-hidden">
                                    {book.cover_url ? (
                                        <img
                                            src={book.cover_url}
                                            alt={book.title}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-200 to-slate-300">
                                            <BookOpen className="text-slate-400" size={48} />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                                        <button className="w-full py-2 bg-white/90 backdrop-blur-sm rounded-lg text-xs font-bold text-slate-900 shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                            View Details
                                        </button>
                                    </div>

                                    {/* Status Badge */}
                                    <div className="absolute top-2 right-2">
                                        {book.status === 'finished' && (
                                            <div className="bg-green-500 text-white p-1 rounded-full shadow-md">
                                                <CheckCircle size={12} />
                                            </div>
                                        )}
                                        {book.status === 'reading' && (
                                            <div className="bg-primary text-white p-1 rounded-full shadow-md">
                                                <Clock size={12} />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Book Info */}
                                <div className="p-3">
                                    <h3 className="font-bold text-slate-800 text-sm truncate leading-tight mb-1">
                                        {book.title}
                                    </h3>
                                    <p className="text-xs text-muted truncate mb-3">{book.author || 'Unknown Author'}</p>

                                    {/* Progress Bar */}
                                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mb-2">
                                        <div
                                            className={`h-full rounded-full ${book.status === 'finished' ? 'bg-green-500' : 'bg-primary'
                                                }`}
                                            style={{ width: `${progress}%` }}
                                        ></div>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] text-slate-400 font-medium">
                                            {progress}% read
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
