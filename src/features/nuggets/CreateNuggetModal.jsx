import { useState, useEffect } from 'react';
import { X, Book, Loader2, Save } from 'lucide-react';
import { getBooks } from '../../services/bookService';
import { createNugget } from '../../services/nuggetService';

export default function CreateNuggetModal({ isOpen, onClose, onNuggetCreated }) {
    const [books, setBooks] = useState([]);
    const [loadingBooks, setLoadingBooks] = useState(false);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        book_id: '',
        content: '',
        page_number: '',
        tags: '',
        note: ''
    });

    useEffect(() => {
        if (isOpen) {
            loadBooks();
        }
    }, [isOpen]);

    const loadBooks = async () => {
        try {
            setLoadingBooks(true);
            const data = await getBooks();
            setBooks(data);
            // If books exist and no book selected, select the first one
            if (data.length > 0 && !formData.book_id) {
                setFormData(prev => ({ ...prev, book_id: data[0].id }));
            }
        } catch (error) {
            console.error('Error loading books:', error);
        } finally {
            setLoadingBooks(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.content.trim() || !formData.book_id) return;

        try {
            setSaving(true);

            // Format tags: split by comma, trim whitespace
            const formattedTags = formData.tags
                ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
                : [];

            await createNugget({
                book_id: formData.book_id,
                content: formData.content,
                page_number: formData.page_number ? parseInt(formData.page_number) : null,
                tags: formattedTags,
                note: formData.note,
                is_favorite: false
            });

            // Reset form
            setFormData({
                book_id: books.length > 0 ? books[0].id : '',
                content: '',
                page_number: '',
                tags: '',
                note: ''
            });

            onNuggetCreated();
            onClose();
        } catch (error) {
            console.error('Error creating nugget:', error);
            alert('Failed to create nugget: ' + error.message);
        } finally {
            setSaving(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden animate-slide-up max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <h3 className="font-bold text-lg text-slate-800">Capture Wisdom</h3>
                    <button
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 overflow-y-auto">
                    <div className="space-y-5">
                        {/* Book Selection */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Source Book</label>
                            {loadingBooks ? (
                                <div className="flex items-center gap-2 text-sm text-muted p-3 bg-slate-50 rounded-xl">
                                    <Loader2 className="animate-spin" size={16} />
                                    Loading books...
                                </div>
                            ) : books.length > 0 ? (
                                <div className="relative">
                                    <Book className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <select
                                        value={formData.book_id}
                                        onChange={(e) => setFormData({ ...formData, book_id: e.target.value })}
                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all appearance-none"
                                        required
                                    >
                                        {books.map(book => (
                                            <option key={book.id} value={book.id}>
                                                {book.title}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            ) : (
                                <div className="text-sm text-amber-600 bg-amber-50 p-3 rounded-xl border border-amber-100">
                                    You need to add books to your library first.
                                </div>
                            )}
                        </div>

                        {/* Quote Content */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">The Nugget *</label>
                            <textarea
                                value={formData.content}
                                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                placeholder="What wisdom did you find?"
                                className="w-full p-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all min-h-[120px] resize-none"
                                required
                            />
                        </div>

                        {/* Page Number & Tags */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Page No.</label>
                                <input
                                    type="number"
                                    value={formData.page_number}
                                    onChange={(e) => setFormData({ ...formData, page_number: e.target.value })}
                                    placeholder="e.g. 42"
                                    className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Tags</label>
                                <input
                                    type="text"
                                    value={formData.tags}
                                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                    placeholder="wisdom, life..."
                                    className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                />
                            </div>
                        </div>

                        {/* Personal Note */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Your Thoughts (Optional)</label>
                            <textarea
                                value={formData.note}
                                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                                placeholder="Why does this resonate with you?"
                                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all min-h-[80px] resize-none text-sm"
                            />
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-8 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 px-4 rounded-xl font-medium text-slate-600 hover:bg-slate-100 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={saving || books.length === 0}
                            className="flex-[2] py-3 px-4 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {saving ? (
                                <>
                                    <Loader2 className="animate-spin" size={18} />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save size={18} />
                                    Save Nugget
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
