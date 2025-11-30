import { useState } from 'react';
import { Search, BookOpen, Plus, ScanLine, ArrowRight } from 'lucide-react';

export default function AddBookPage() {
  const [activeTab, setActiveTab] = useState('search');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data for search results
  const mockResults = [
    {
      id: 1,
      title: "Atomic Habits",
      author: "James Clear",
      cover: "https://books.google.com/books/content?id=XfFvDwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api",
      year: "2018"
    },
    {
      id: 2,
      title: "Deep Work",
      author: "Cal Newport",
      cover: "https://books.google.com/books/content?id=X1WQDwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api",
      year: "2016"
    }
  ];

  return (
    <div className="pb-24 pt-8 px-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600">
          Add Book
        </h1>
        <p className="text-muted mt-1">Build your library of wisdom</p>
      </header>

      {/* Mode Switcher */}
      <div className="flex p-1 bg-slate-100 rounded-2xl mb-8 relative overflow-hidden">
        <button
          onClick={() => setActiveTab('search')}
          className={`flex-1 flex items-center justify-center py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
            activeTab === 'search' 
              ? 'bg-white text-primary shadow-sm' 
              : 'text-muted hover:text-slate-600'
          }`}
        >
          <Search size={18} className="mr-2" />
          Search
        </button>
        <button
          onClick={() => setActiveTab('manual')}
          className={`flex-1 flex items-center justify-center py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
            activeTab === 'manual' 
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
            {searchQuery && (
              <p className="text-sm font-medium text-muted mb-4">
                Found {mockResults.length} results
              </p>
            )}
            
            {searchQuery ? (
              mockResults.map((book) => (
                <div key={book.id} className="card flex gap-4 items-center group cursor-pointer hover:border-primary/30">
                  <div className="w-16 h-24 bg-slate-200 rounded-lg shadow-sm overflow-hidden flex-shrink-0">
                    <img src={book.cover} alt={book.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-800 truncate">{book.title}</h3>
                    <p className="text-sm text-muted truncate">{book.author}</p>
                    <p className="text-xs text-slate-400 mt-1">{book.year}</p>
                  </div>
                  <button className="p-3 rounded-full bg-slate-50 text-primary opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                    <Plus size={20} />
                  </button>
                </div>
              ))
            ) : (
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
        <div className="animate-fade-in space-y-6">
          {/* Manual Entry Form */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Book Title</label>
              <input type="text" className="w-full p-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" placeholder="e.g. The Psychology of Money" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Author</label>
              <input type="text" className="w-full p-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" placeholder="e.g. Morgan Housel" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Total Pages</label>
                <input type="number" className="w-full p-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" placeholder="0" />
              </div>
              <div>
                 <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                 <select className="w-full p-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all appearance-none">
                   <option>Non-fiction</option>
                   <option>Fiction</option>
                   <option>Business</option>
                   <option>Self-help</option>
                 </select>
              </div>
            </div>
          </div>

          <button className="w-full btn-primary flex items-center justify-center gap-2 mt-8">
            Add to Library
            <ArrowRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
