import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Heart, Plus, Trash2, Loader2, Sparkles, Calendar, Hash, BookMarked } from 'lucide-react';
import { getBookById, deleteBook } from '../../services/bookService';
import { getNuggetsByBook } from '../../services/nuggetService';
import CreateNuggetModal from '../nuggets/CreateNuggetModal';

export default function BookDetailsPage() {
    const { bookId } = useParams();
    const navigate = useNavigate();

    const [book, setBook] = useState(null);
    const [nuggets, setNuggets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        loadBookDetails();
    }, [bookId]);

    const loadBookDetails = async () => {
        try {
            setLoading(true);
            const [bookData, nuggetsData] = await Promise.all([
                getBookById(bookId),
                getNuggetsByBook(bookId)
            ]);
            setBook(bookData);
            setNuggets(nuggetsData);
        } catch (error) {
            console.error('Error loading book details:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteBook = async () => {
        if (!confirm('Are you sure you want to delete this book and all its nuggets?')) return;

        try {
            await deleteBook(bookId);
            navigate('/library');
        } catch (error) {
            console.error('Error deleting book:', error);
            alert('Failed to delete book');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="animate-spin text-primary" size={32} />
            </div>
        );
    }

    if (!book) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center px-6">
                <h2 className="text-xl font-bold text-slate-800 mb-2">Book not found</h2>
                <button onClick={() => navigate('/library')} className="btn-primary">
                    Back to Library
                </button>
            </div>
        );
    }

    return (
        <div className="pb-24 pt-6 px-6 max-w-4xl mx-auto">
            {/* Header */}
            <button
                onClick={() => navigate('/library')}
                className="flex items-center gap-2 text-slate-600 hover:text-slate-800 mb-6 transition-colors"
            >
                <ArrowLeft size={20} />
                <span className="font-medium">Back to Library</span>
            </button>

            {/* Book Info Card */}
            <div className="card mb-8">
                <div className="flex gap-6">
                    {/* Cover */}
                    <div className="w-40 h-60 bg-slate-200 rounded-lg shadow-lg overflow-hidden flex-shrink-0">
                        {book.cover_url ? (
                            <img src={book.cover_url} alt={book.title} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-200 to-slate-300">
                                <BookOpen className="text-slate-400" size={56} />
                            </div>
                        )}
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold text-slate-800 mb-2 leading-tight">{book.title}</h1>
                        <p className="text-xl text-muted mb-6">by {book.author || 'Unknown Author'}</p>

                        {/* Metadata Grid */}
                        <div className="grid grid-cols-2 gap-3 mb-6 text-sm">
                            {book.publisher && (
                                <div className="flex items-start gap-2">
                                    <BookMarked size={16} className="text-slate-400 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="text-xs text-slate-500 uppercase tracking-wide">Publisher</p>
                                        <p className="text-slate-700 font-medium">{book.publisher}</p>
                                    </div>
                                </div>
                            )}

                            {book.published_date && (
                                <div className="flex items-start gap-2">
                                    <Calendar size={16} className="text-slate-400 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="text-xs text-slate-500 uppercase tracking-wide">Published</p>
                                        <p className="text-slate-700 font-medium">{book.published_date.split('-')[0]}</p>
                                    </div>
                                </div>
                            )}

                            {book.total_pages && (
                                <div className="flex items-start gap-2">
                                    <BookOpen size={16} className="text-slate-400 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="text-xs text-slate-500 uppercase tracking-wide">Pages</p>
                                        <p className="text-slate-700 font-medium">{book.total_pages} pages</p>
                                    </div>
                                </div>
                            )}

                            {book.isbn && (
                                <div className="flex items-start gap-2">
                                    <Hash size={16} className="text-slate-400 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="text-xs text-slate-500 uppercase tracking-wide">ISBN</p>
                                        <p className="text-slate-700 font-medium font-mono text-xs">{book.isbn}</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors shadow-sm hover:shadow-md"
                            >
                                <Plus size={18} />
                                Add Nugget
                            </button>
                            <button
                                onClick={handleDeleteBook}
                                className="px-3 py-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-rose-200 hover:border-rose-300"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Nugget Count Badge */}
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-slate-800">
                    Captured Wisdom
                </h2>
                <div className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-bold">
                    {nuggets.length} {nuggets.length === 1 ? 'Nugget' : 'Nuggets'}
                </div>
            </div>

            {/* Nuggets Section */}
            {nuggets.length === 0 ? (
                <div className="card text-center py-16">
                    <Sparkles className="mx-auto mb-4 text-slate-300" size={56} />
                    <h3 className="text-xl font-semibold text-slate-600 mb-2">No nuggets yet</h3>
                    <p className="text-slate-400 mb-8 max-w-md mx-auto">
                        Start capturing inspiring quotes and insights from this book
                    </p>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="btn-primary inline-flex items-center gap-2"
                    >
                        <Plus size={20} />
                        Capture First Nugget
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {nuggets.map((nugget) => (
                        <div key={nugget.id} className="card hover:border-primary/30 hover:shadow-md transition-all">
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <p className="text-slate-800 font-serif text-lg mb-3 leading-relaxed">
                                        "{nugget.content}"
                                    </p>

                                    {nugget.note && (
                                        <p className="text-sm text-slate-600 italic mb-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                                            💭 {nugget.note}
                                        </p>
                                    )}

                                    <div className="flex items-center gap-3 flex-wrap">
                                        {nugget.page_number && (
                                            <span className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded-md font-medium">
                                                Page {nugget.page_number}
                                            </span>
                                        )}
                                        {nugget.tags && nugget.tags.map(tag => (
                                            <span key={tag} className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-md font-medium">
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <button className={`p-2 h-fit rounded-full transition-colors ${nugget.is_favorite
                                        ? 'text-rose-500 bg-rose-50'
                                        : 'text-slate-400 hover:text-rose-500 hover:bg-rose-50'
                                    }`}>
                                    <Heart size={20} fill={nugget.is_favorite ? "currentColor" : "none"} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <CreateNuggetModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onNuggetCreated={loadBookDetails}
            />
        </div>
    );
}
