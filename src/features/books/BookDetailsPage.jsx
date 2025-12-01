import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Heart, Plus, Edit, Trash2, Loader2, Save, Sparkles } from 'lucide-react';
import { getBookById, updateBook, deleteBook } from '../../services/bookService';
import { getNuggetsByBook } from '../../services/nuggetService';
import CreateNuggetModal from '../nuggets/CreateNuggetModal';

export default function BookDetailsPage() {
    const { bookId } = useParams();
    const navigate = useNavigate();

    const [book, setBook] = useState(null);
    const [nuggets, setNuggets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);

    const [editData, setEditData] = useState({
        current_page: 0,
        status: 'toread'
    });

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
            setEditData({
                current_page: bookData.current_page || 0,
                status: bookData.status || 'toread'
            });
        } catch (error) {
            console.error('Error loading book details:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveProgress = async () => {
        try {
            setSaving(true);
            await updateBook(bookId, editData);
            setBook({ ...book, ...editData });
            setEditing(false);
        } catch (error) {
            console.error('Error updating book:', error);
            alert('Failed to update book progress');
        } finally {
            setSaving(false);
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

    const getProgress = () => {
        if (!book?.total_pages || book.total_pages === 0) return 0;
        return Math.round((editData.current_page / book.total_pages) * 100);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'reading': return 'bg-blue-500';
            case 'finished': return 'bg-green-500';
            case 'toread': return 'bg-slate-400';
            default: return 'bg-slate-400';
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

            {/* Hero Section */}
            <div className="card mb-8">
                <div className="flex gap-6">
                    {/* Cover */}
                    <div className="w-32 h-48 bg-slate-200 rounded-lg shadow-md overflow-hidden flex-shrink-0">
                        {book.cover_url ? (
                            <img src={book.cover_url} alt={book.title} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-200 to-slate-300">
                                <BookOpen className="text-slate-400" size={48} />
                            </div>
                        )}
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold text-slate-800 mb-2">{book.title}</h1>
                        <p className="text-lg text-muted mb-4">{book.author || 'Unknown Author'}</p>

                        <div className="flex gap-3 mb-4 text-sm text-slate-600">
                            {book.total_pages && <span>{book.total_pages} pages</span>}
                            <span className={`px-3 py-1 rounded-full text-white text-xs font-medium ${getStatusColor(book.status)}`}>
                                {book.status === 'toread' ? 'To Read' : book.status.charAt(0).toUpperCase() + book.status.slice(1)}
                            </span>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
                            >
                                <Plus size={18} />
                                Add Nugget
                            </button>
                            <button
                                onClick={handleDeleteBook}
                                className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Progress Section */}
            <div className="card mb-8">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-slate-800">Reading Progress</h2>
                    {!editing ? (
                        <button
                            onClick={() => setEditing(true)}
                            className="flex items-center gap-2 text-primary hover:text-primary/80 text-sm font-medium"
                        >
                            <Edit size={16} />
                            Edit
                        </button>
                    ) : (
                        <div className="flex gap-2">
                            <button
                                onClick={() => {
                                    setEditing(false);
                                    setEditData({
                                        current_page: book.current_page || 0,
                                        status: book.status || 'toread'
                                    });
                                }}
                                className="px-3 py-1 text-slate-600 hover:bg-slate-100 rounded-lg text-sm"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveProgress}
                                disabled={saving}
                                className="flex items-center gap-2 px-3 py-1 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50"
                            >
                                {saving ? <Loader2 className="animate-spin" size={14} /> : <Save size={14} />}
                                Save
                            </button>
                        </div>
                    )}
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                    <div className="flex justify-between text-sm text-slate-600 mb-2">
                        <span>{getProgress()}% complete</span>
                        <span>{editData.current_page} / {book.total_pages || 0} pages</span>
                    </div>
                    <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                        <div
                            className={`h-full rounded-full transition-all ${book.status === 'finished' ? 'bg-green-500' : 'bg-primary'
                                }`}
                            style={{ width: `${getProgress()}%` }}
                        />
                    </div>
                </div>

                {/* Edit Controls */}
                {editing && (
                    <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-xl">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Current Page</label>
                            <input
                                type="number"
                                value={editData.current_page}
                                onChange={(e) => setEditData({ ...editData, current_page: parseInt(e.target.value) || 0 })}
                                min="0"
                                max={book.total_pages || 0}
                                className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                            <select
                                value={editData.status}
                                onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                                className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                            >
                                <option value="toread">To Read</option>
                                <option value="reading">Reading</option>
                                <option value="finished">Finished</option>
                            </select>
                        </div>
                    </div>
                )}
            </div>

            {/* Nuggets Section */}
            <div>
                <h2 className="text-xl font-bold text-slate-800 mb-4">
                    Your Nuggets ({nuggets.length})
                </h2>

                {nuggets.length === 0 ? (
                    <div className="card text-center py-12">
                        <Sparkles className="mx-auto mb-4 text-slate-300" size={48} />
                        <h3 className="text-lg font-semibold text-slate-600 mb-2">No nuggets yet</h3>
                        <p className="text-slate-400 text-sm mb-6">
                            Start capturing wisdom from this book
                        </p>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="btn-primary inline-flex items-center gap-2"
                        >
                            <Plus size={18} />
                            Add First Nugget
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {nuggets.map((nugget) => (
                            <div key={nugget.id} className="card hover:border-primary/30 transition-colors">
                                <div className="flex gap-4">
                                    <div className="flex-1">
                                        <p className="text-slate-800 font-serif text-lg mb-3 leading-relaxed">
                                            "{nugget.content}"
                                        </p>

                                        {nugget.note && (
                                            <p className="text-sm text-slate-600 italic mb-3 p-3 bg-slate-50 rounded-lg">
                                                {nugget.note}
                                            </p>
                                        )}

                                        <div className="flex items-center gap-3">
                                            {nugget.page_number && (
                                                <span className="text-xs text-slate-500">Page {nugget.page_number}</span>
                                            )}
                                            {nugget.tags && nugget.tags.map(tag => (
                                                <span key={tag} className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded-full">
                                                    #{tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <button className={`p-2 h-fit rounded-full transition-colors ${nugget.is_favorite
                                            ? 'text-rose-500 bg-rose-50'
                                            : 'text-slate-400 hover:text-rose-500 hover:bg-rose-50'
                                        }`}>
                                        <Heart size={18} fill={nugget.is_favorite ? "currentColor" : "none"} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <CreateNuggetModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onNuggetCreated={loadBookDetails}
            />
        </div>
    );
}
