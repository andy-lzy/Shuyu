import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getBookById, deleteBook } from '../../services/bookService';
import { getNuggetsByBookId, createNugget } from '../../services/nuggetService';
import { ArrowLeft, BookOpen, Trash2, Plus, Loader2, Share2, Quote } from 'lucide-react';
import ShareNuggetModal from '../nuggets/ShareNuggetModal';

export default function BookDetailsPage() {
    const { bookId } = useParams();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const [book, setBook] = useState(null);
    const [nuggets, setNuggets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // New Nugget State
    const [showAddNugget, setShowAddNugget] = useState(false);
    const [newNugget, setNewNugget] = useState({ content: '', page_number: '', note: '', tags: '' });
    const [savingNugget, setSavingNugget] = useState(false);

    // Sharing State
    const [shareModalOpen, setShareModalOpen] = useState(false);
    const [selectedNugget, setSelectedNugget] = useState(null);

    useEffect(() => {
        loadData();
    }, [bookId]);

    async function loadData() {
        try {
            setLoading(true);
            const [bookData, nuggetsData] = await Promise.all([
                getBookById(bookId),
                getNuggetsByBookId(bookId)
            ]);
            setBook(bookData);
            setNuggets(nuggetsData);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    const handleDeleteBook = async () => {
        if (window.confirm(t('bookDetails.confirmDelete'))) {
            try {
                await deleteBook(bookId);
                navigate('/library');
            } catch (err) {
                alert(t('common.error') + ': ' + err.message);
            }
        }
    };

    const handleAddNugget = async (e) => {
        e.preventDefault();
        if (!newNugget.content.trim()) return;

        try {
            setSavingNugget(true);
            const tagsArray = newNugget.tags.split(',').map(tag => tag.trim()).filter(tag => tag);

            await createNugget({
                book_id: bookId,
                content: newNugget.content,
                page_number: newNugget.page_number ? parseInt(newNugget.page_number) : null,
                note: newNugget.note,
                tags: tagsArray
            });

            // Refresh nuggets
            const updatedNuggets = await getNuggetsByBookId(bookId);
            setNuggets(updatedNuggets);

            // Reset form
            setNewNugget({ content: '', page_number: '', note: '', tags: '' });
            setShowAddNugget(false);
        } catch (err) {
            alert(t('common.error') + ': ' + err.message);
        } finally {
            setSavingNugget(false);
        }
    };

    const handleShare = (nugget) => {
        setSelectedNugget(nugget);
        setShareModalOpen(true);
    };

    if (loading) return <div className="flex justify-center py-12"><Loader2 className="animate-spin" /></div>;
    if (error) return <div className="p-6 text-rose-600">{t('common.error')}: {error}</div>;
    if (!book) return <div className="p-6">Book not found</div>;

    return (
        <div className="pb-24 pt-8 px-6">
            {/* Header */}
            <header className="mb-8">
                <button onClick={() => navigate('/library')} className="mb-4 text-slate-500 hover:text-slate-800 transition-colors">
                    <ArrowLeft size={24} />
                </button>

                <div className="flex gap-6">
                    <div className="w-24 h-36 bg-slate-200 rounded-lg shadow-md overflow-hidden flex-shrink-0">
                        {book.cover_url ? (
                            <img src={book.cover_url} alt={book.title} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-300">
                                <BookOpen size={32} />
                            </div>
                        )}
                    </div>
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold text-slate-800 leading-tight mb-2">{book.title}</h1>
                        <p className="text-slate-600 font-medium mb-2">{book.author}</p>
                        <div className="flex flex-wrap gap-2 text-xs text-slate-400 mb-4">
                            {book.total_pages && <span>{t('bookDetails.pages', { count: book.total_pages })}</span>}
                            {book.published_date && <span>• {book.published_date.split('-')[0]}</span>}
                            {book.publisher && <span>• {book.publisher}</span>}
                        </div>
                        <button
                            onClick={handleDeleteBook}
                            className="text-rose-400 text-sm flex items-center gap-1 hover:text-rose-600 transition-colors"
                        >
                            <Trash2 size={14} />
                            {t('bookDetails.delete')}
                        </button>
                    </div>
                </div>
            </header>

            {/* Nuggets Section */}
            <section>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-slate-800">{t('bookDetails.nuggets')}</h2>
                    <button
                        onClick={() => setShowAddNugget(!showAddNugget)}
                        className="flex items-center gap-1 text-primary font-bold text-sm bg-primary/10 px-3 py-1.5 rounded-full hover:bg-primary/20 transition-colors"
                    >
                        <Plus size={16} />
                        {t('bookDetails.addNugget')}
                    </button>
                </div>

                {/* Add Nugget Form */}
                {showAddNugget && (
                    <form onSubmit={handleAddNugget} className="mb-8 bg-slate-50 p-4 rounded-xl border border-slate-100 animate-fade-in">
                        <textarea
                            value={newNugget.content}
                            onChange={(e) => setNewNugget({ ...newNugget, content: e.target.value })}
                            placeholder={t('bookDetails.nuggetPlaceholder')}
                            className="w-full p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none min-h-[100px] mb-3"
                            autoFocus
                        />
                        <div className="grid grid-cols-2 gap-3 mb-3">
                            <input
                                type="number"
                                value={newNugget.page_number}
                                onChange={(e) => setNewNugget({ ...newNugget, page_number: e.target.value })}
                                placeholder={t('bookDetails.page')}
                                className="p-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary/20 outline-none"
                            />
                            <input
                                type="text"
                                value={newNugget.tags}
                                onChange={(e) => setNewNugget({ ...newNugget, tags: e.target.value })}
                                placeholder={t('bookDetails.tags')}
                                className="p-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary/20 outline-none"
                            />
                        </div>
                        <input
                            type="text"
                            value={newNugget.note}
                            onChange={(e) => setNewNugget({ ...newNugget, note: e.target.value })}
                            placeholder={t('bookDetails.note')}
                            className="w-full p-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary/20 outline-none mb-3"
                        />
                        <div className="flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => setShowAddNugget(false)}
                                className="px-4 py-2 text-slate-500 font-medium hover:text-slate-700"
                            >
                                {t('common.cancel')}
                            </button>
                            <button
                                type="submit"
                                disabled={savingNugget}
                                className="px-4 py-2 bg-slate-900 text-white rounded-lg font-bold hover:bg-slate-800 disabled:opacity-50"
                            >
                                {savingNugget ? <Loader2 className="animate-spin" size={18} /> : t('bookDetails.saveNugget')}
                            </button>
                        </div>
                    </form>
                )}

                {/* Nuggets List */}
                <div className="space-y-4">
                    {nuggets.length === 0 && !showAddNugget ? (
                        <div className="text-center py-12 text-slate-400">
                            <p>{t('bookDetails.noNuggets')}</p>
                        </div>
                    ) : (
                        nuggets.map((nugget) => (
                            <div key={nugget.id} className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
                                <div className="flex gap-3 mb-3">
                                    <Quote className="text-primary/40 flex-shrink-0" size={20} />
                                    <p className="text-slate-800 font-serif text-lg leading-relaxed">{nugget.content}</p>
                                </div>

                                {nugget.note && (
                                    <div className="ml-8 mb-3 p-3 bg-slate-50 rounded-lg text-sm text-slate-600 italic">
                                        {nugget.note}
                                    </div>
                                )}

                                <div className="flex justify-between items-center ml-8 pt-2 border-t border-slate-50">
                                    <div className="flex gap-2">
                                        {nugget.page_number && (
                                            <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-md">
                                                P. {nugget.page_number}
                                            </span>
                                        )}
                                        {nugget.tags && nugget.tags.map(tag => (
                                            <span key={tag} className="text-xs text-primary bg-primary/5 px-2 py-1 rounded-md">
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>

                                    <button
                                        onClick={() => handleShare(nugget)}
                                        className="text-slate-400 hover:text-primary transition-colors p-2 -mr-2"
                                        title={t('focus.share')}
                                    >
                                        <Share2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </section>

            {/* Share Modal */}
            {selectedNugget && (
                <ShareNuggetModal
                    isOpen={shareModalOpen}
                    onClose={() => {
                        setShareModalOpen(false);
                        setSelectedNugget(null);
                    }}
                    nugget={selectedNugget}
                />
            )}
        </div>
    );
}
