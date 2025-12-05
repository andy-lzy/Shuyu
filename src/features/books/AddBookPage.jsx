import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Search, BookOpen, Plus, ScanLine, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import { createBook } from '../../services/bookService';
import { searchGoogleBooks } from '../../services/googleBooksService';
import { useDebounce } from '../../hooks/useDebounce';

export default function AddBookPage() {
  const [activeTab, setActiveTab] = useState('search'); // 'search' or 'manual'
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();
  const { t } = useTranslation();

  // Debounce search query to avoid excessive API calls
  const debouncedSearchQuery = useDebounce(searchQuery, 600);

  // Form state for manual entry
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    publisher: '',
    published_date: '',
    isbn: '',
    total_pages: '',
    cover_url: '',
    status: 'toread'
  });

  // Search books when debounced query changes
  useEffect(() => {
    if (debouncedSearchQuery.trim().length === 0) {
      setSearchResults([]);
      return;
    }

    const searchBooks = async () => {
      try {
        setSearching(true);
        setSearchError(null);
        const results = await searchGoogleBooks(debouncedSearchQuery, 10);
        setSearchResults(results);
      } catch (error) {
        console.error('Search error:', error);
        setSearchError(t('common.error'));
        setSearchResults([]);
      } finally {
        setSearching(false);
      }
    };

    searchBooks();
  }, [debouncedSearchQuery, t]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      alert(t('addBook.form.title') + ' is required');
      return;
    }

    try {
      setSaving(true);
      setSuccess(false);

      await createBook({
        title: formData.title,
        author: formData.author || null,
        publisher: formData.publisher || null,
        published_date: formData.published_date || null,
        isbn: formData.isbn || null,
        total_pages: formData.total_pages ? parseInt(formData.total_pages) : null,
        cover_url: formData.cover_url || null,
        current_page: 0,
        status: formData.status
      });

      setSuccess(true);

      // Reset form
      setFormData({
        title: '',
        author: '',
        publisher: '',
        published_date: '',
        isbn: '',
        total_pages: '',
        cover_url: '',
        status: 'toread'
      });

      // Navigate to library after 1.5 seconds
      setTimeout(() => {
        navigate('/library');
      }, 1500);

    } catch (error) {
      console.error('Error adding book:', error);
      alert(t('common.error') + ': ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSelectBook = (book) => {
    // Populate form with selected book data
    setFormData({
      title: book.title,
      author: book.author,
      publisher: book.publisher || '',
      published_date: book.publishedDate || '',
      isbn: book.isbn || '',
      total_pages: book.pageCount || '',
      cover_url: book.coverUrl || '',
      status: 'toread'
    });

    // Switch to manual tab for editing
    setActiveTab('manual');
    // Clear search to avoid confusion when switching back
    setSearchQuery('');
    setSearchResults([]);
  };

  return (
    <div className="pb-24 pt-8 px-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600">
          {t('addBook.title')}
        </h1>
        <p className="text-muted mt-1">{t('addBook.subtitle')}</p>
      </header>

      {/* Success Message */}
      {success && (
        <div className="mb-6 bg-green-50 text-green-700 p-4 rounded-xl flex items-center gap-3 border border-green-100 animate-fade-in">
          <CheckCircle2 size={20} />
          <span className="font-medium">{t('addBook.success')}</span>
        </div>
      )}

      {/* Mode Switcher */}
      <div className="flex p-1 bg-slate-100 rounded-2xl mb-8 relative overflow-hidden">
        <button
          onClick={() => setActiveTab('search')}
          className={`flex-1 flex items-center justify-center py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${activeTab === 'search'
            ? 'bg-white text-primary shadow-sm'
            : 'text-muted hover:text-slate-600'
            }`}
        >
          <Search size={18} className="mr-2" />
          {t('addBook.searchTab')}
        </button>
        <button
          onClick={() => setActiveTab('manual')}
          className={`flex-1 flex items-center justify-center py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${activeTab === 'manual'
            ? 'bg-white text-primary shadow-sm'
            : 'text-muted hover:text-slate-600'
            }`}
        >
          <BookOpen size={18} className="mr-2" />
          {t('addBook.manualTab')}
        </button>
      </div>

      {activeTab === 'search' ? (
        <div className="animate-fade-in">
          {/* Search Bar */}
          <div className="relative mb-8">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-11 pr-4 py-4 bg-white border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
              placeholder={t('addBook.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <button className="p-2 text-slate-400 hover:text-primary transition-colors">
                <ScanLine size={20} />
              </button>
            </div>
          </div>

          {/* Results Area */}
          <div className="space-y-4">
            {/* Search status */}
            {searching && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="animate-spin text-primary mr-2" size={24} />
                <span className="text-muted">{t('addBook.searching')}</span>
              </div>
            )}

            {/* Error state */}
            {searchError && !searching && (
              <div className="bg-rose-50 text-rose-600 p-4 rounded-xl text-sm border border-rose-100">
                {searchError}
              </div>
            )}

            {/* Results count */}
            {!searching && searchResults.length > 0 && (
              <p className="text-sm font-medium text-muted mb-4">
                {t('addBook.foundResults', { count: searchResults.length })}
              </p>
            )}

            {/* Search results */}
            {!searching && searchResults.length > 0 && (
              searchResults.map((book) => (
                <div key={book.googleBooksId} className="card flex gap-4 items-center group cursor-pointer hover:border-primary/30">
                  <div className="w-16 h-24 bg-slate-200 rounded-lg shadow-sm overflow-hidden flex-shrink-0">
                    {book.coverUrl ? (
                      <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-200 to-slate-300">
                        <BookOpen className="text-slate-400" size={24} />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-800 truncate">{book.title}</h3>
                    <p className="text-sm text-muted truncate">{book.author}</p>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      {book.publishedDate && (
                        <p className="text-xs text-slate-400">{book.publishedDate.split('-')[0]}</p>
                      )}
                      {book.publisher && (
                        <>
                          <span className="text-xs text-slate-300">•</span>
                          <p className="text-xs text-slate-400 truncate max-w-[150px]">{book.publisher}</p>
                        </>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleSelectBook(book)}
                    className="px-4 py-2 rounded-lg bg-slate-50 text-primary font-bold text-sm hover:bg-slate-100 transition-colors"
                  >
                    {t('addBook.buttons.select')}
                  </button>
                </div>
              ))
            )}

            {/* No results */}
            {!searching && searchQuery && searchResults.length === 0 && !searchError && (
              <div className="text-center py-12 opacity-60">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="text-slate-300" size={32} />
                </div>
                <p className="text-muted">{t('addBook.noResults')}</p>
                <p className="text-sm text-slate-400 mt-1">{t('addBook.tryAgain')}</p>
              </div>
            )}

            {/* Empty state */}
            {!searching && !searchQuery && (
              <div className="text-center py-12 opacity-60">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="text-slate-300" size={32} />
                </div>
                <p className="text-muted">{t('addBook.startTyping')}</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="animate-fade-in space-y-6">
          {/* Manual Entry Form */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t('addBook.form.title')} *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full p-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t('addBook.form.author')}</label>
              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleInputChange}
                className="w-full p-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t('addBook.form.publisher')}</label>
                <input
                  type="text"
                  name="publisher"
                  value={formData.publisher}
                  onChange={handleInputChange}
                  className="w-full p-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t('addBook.form.publishedDate')}</label>
                <input
                  type="text"
                  name="published_date"
                  value={formData.published_date}
                  onChange={handleInputChange}
                  className="w-full p-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  placeholder="YYYY-MM-DD"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t('addBook.form.totalPages')}</label>
                <input
                  type="number"
                  name="total_pages"
                  value={formData.total_pages}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full p-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t('addBook.form.status')}</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full p-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all appearance-none"
                >
                  <option value="toread">{t('library.tabs.toread')}</option>
                  <option value="reading">{t('library.tabs.reading')}</option>
                  <option value="finished">{t('library.tabs.finished')}</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t('addBook.form.isbn')}</label>
              <input
                type="text"
                name="isbn"
                value={formData.isbn}
                onChange={handleInputChange}
                className="w-full p-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full btn-primary flex items-center justify-center gap-2 mt-8"
          >
            {saving ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                {t('addBook.buttons.adding')}
              </>
            ) : (
              <>
                {t('addBook.buttons.addToLibrary')}
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
