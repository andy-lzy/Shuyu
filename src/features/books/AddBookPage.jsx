import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, BookOpen, Plus, ScanLine, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import { createBook } from '../../services/bookService';
import { searchGoogleBooks } from '../../services/googleBooksService';
import { useDebounce } from '../../hooks/useDebounce';

export default function AddBookPage() {
  const [activeTab, setActiveTab] = useState('manual');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  // Debounce search query to avoid excessive API calls
  const debouncedSearchQuery = useDebounce(searchQuery, 600);

  // Form state for manual entry
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    total_pages: '',
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
        setSearchError('Failed to search books. Please try again.');
        setSearchResults([]);
      } finally {
        setSearching(false);
      }
    };

    searchBooks();
  }, [debouncedSearchQuery]);

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
      alert('Please enter a book title');
      return;
    }

    try {
      setSaving(true);
      setSuccess(false);

      await createBook({
        title: formData.title,
        author: formData.author || null,
        total_pages: formData.total_pages ? parseInt(formData.total_pages) : null,
        current_page: 0,
        status: formData.status,
        cover_url: null
      });

      setSuccess(true);

      // Reset form
      setFormData({
        title: '',
        author: '',
        total_pages: '',
        status: 'toread'
      });

      // Navigate to library after 1.5 seconds
      setTimeout(() => {
        navigate('/library');
      }, 1500);

    } catch (error) {
      console.error('Error adding book:', error);
      alert('Failed to add book: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleAddFromSearch = async (book) => {
    try {
      setSaving(true);

      await createBook({
        title: book.title,
        author: book.author,
        cover_url: book.coverUrl,
        total_pages: book.pageCount,
        status: 'toread',
        current_page: 0
      });

      setSuccess(true);
      setTimeout(() => {
        navigate('/library');
      }, 1500);

    } catch (error) {
      console.error('Error adding book:', error);
      alert('Failed to add book: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="pb-24 pt-8 px-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600">
          Add Book
        </h1>
        <p className="text-muted mt-1">Build your library of wisdom</p>
      </header>

      {/* Success Message */}
      {success && (
        <div className="mb-6 bg-green-50 text-green-700 p-4 rounded-xl flex items-center gap-3 border border-green-100 animate-fade-in">
          <CheckCircle2 size={20} />
          <span className="font-medium">Book added successfully! Redirecting...</span>
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
          Search
        </button>
        <button
          onClick={() => setActiveTab('manual')}
          className={`flex-1 flex items-center justify-center py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${activeTab === 'manual'
            ? 'bg-white text-primary shadow-sm'
            : 'text-muted hover:text-slate-600'
            }`}
        >
          <BookOpen size={18} className="mr-2" />
          Manual
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
              placeholder="Search by title, author, or ISBN..."
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
                <span className="text-muted">Searching books...</span>
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
                Found {searchResults.length} results
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
                    <div className="flex items-center gap-2 mt-1">
                      {book.publishedDate && (
                        <p className="text-xs text-slate-400">{book.publishedDate.split('-')[0]}</p>
                      )}
                      {book.pageCount && (
                        <>
                          <span className="text-xs text-slate-300">•</span>
                          <p className="text-xs text-slate-400">{book.pageCount} pages</p>
                        </>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleAddFromSearch(book)}
                    disabled={saving}
                    className="p-3 rounded-full bg-slate-50 text-primary opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0 disabled:opacity-50"
                  >
                    {saving ? <Loader2 className="animate-spin" size={20} /> : <Plus size={20} />}
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
                <p className="text-muted">No books found</p>
                <p className="text-sm text-slate-400 mt-1">Try a different search term</p>
              </div>
            )}

            {/* Empty state */}
            {!searching && !searchQuery && (
              <div className="text-center py-12 opacity-60">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="text-slate-300" size={32} />
                </div>
                <p className="text-muted">Type to search for books</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="animate-fade-in space-y-6">
          {/* Manual Entry Form */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Book Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full p-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                placeholder="e.g. The Psychology of Money"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Author</label>
              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleInputChange}
                className="w-full p-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                placeholder="e.g. Morgan Housel"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Total Pages</label>
                <input
                  type="number"
                  name="total_pages"
                  value={formData.total_pages}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full p-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full p-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all appearance-none"
                >
                  <option value="toread">To Read</option>
                  <option value="reading">Reading</option>
                  <option value="finished">Finished</option>
                </select>
              </div>
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
                Adding...
              </>
            ) : (
              <>
                Add to Library
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
