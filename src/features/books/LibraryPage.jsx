import { useState } from 'react';
import { Search, Filter, MoreVertical, BookOpen, CheckCircle, Clock } from 'lucide-react';

export default function LibraryPage() {
    const [filter, setFilter] = useState('all');

    // Mock data for library books
    const myBooks = [
        {
            id: 1,
            title: "The Psychology of Money",
            author: "Morgan Housel",
            cover: "https://books.google.com/books/content?id=osDSDwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api",
            progress: 75,
            status: 'reading',
            nuggets: 12
        },
        {
            id: 2,
            title: "Atomic Habits",
            author: "James Clear",
            cover: "https://books.google.com/books/content?id=XfFvDwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api",
            progress: 100,
            status: 'finished',
            nuggets: 28
        },
        {
            id: 3,
            title: "Deep Work",
            author: "Cal Newport",
            cover: "https://books.google.com/books/content?id=X1WQDwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api",
            progress: 0,
            status: 'toread',
            nuggets: 0
        },
        {
            id: 4,
            title: "Show Your Work!",
            author: "Austin Kleon",
            cover: "https://books.google.com/books/content?id=CjBBAgAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api",
            progress: 45,
            status: 'reading',
            nuggets: 5
        }
    ];

    return (
        <div className="pb-24 pt-8 px-6">
            <header className="mb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600">
                        My Library
                    </h1>
                    <p className="text-muted mt-1">4 books collected</p>
                </div>
                <button className="p-2 bg-white rounded-full shadow-sm text-slate-400 hover:text-primary transition-colors">
                    <Filter size={20} />
                </button>
            </header>

            {/* Search Bar */}
            <div className="relative mb-8">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                <input
                    type="text"
                    placeholder="Search your books..."
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
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                ))}
            </div>

            {/* Books Grid */}
            <div className="grid grid-cols-2 gap-4">
                {myBooks.map((book) => (
                    <div key={book.id} className="card p-0 overflow-hidden group relative">
                        {/* Cover Image */}
                        <div className="aspect-[2/3] bg-slate-200 relative overflow-hidden">
                            <img src={book.cover} alt={book.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                                <button className="w-full py-2 bg-white/90 backdrop-blur-sm rounded-lg text-xs font-bold text-slate-900 shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                    View Details
                                </button>
                            </div>

                            {/* Status Badge */}
                            <div className="absolute top-2 right-2">
                                {book.status === 'finished' && <div className="bg-green-500 text-white p-1 rounded-full shadow-md"><CheckCircle size={12} /></div>}
                                {book.status === 'reading' && <div className="bg-primary text-white p-1 rounded-full shadow-md"><Clock size={12} /></div>}
                            </div>
                        </div>

                        {/* Book Info */}
                        <div className="p-3">
                            <h3 className="font-bold text-slate-800 text-sm truncate leading-tight mb-1">{book.title}</h3>
                            <p className="text-xs text-muted truncate mb-3">{book.author}</p>

                            {/* Progress Bar */}
                            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mb-2">
                                <div
                                    className={`h-full rounded-full ${book.status === 'finished' ? 'bg-green-500' : 'bg-primary'}`}
                                    style={{ width: `${book.progress}%` }}
                                ></div>
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="text-[10px] text-slate-400 font-medium">{book.progress}% read</span>
                                <div className="flex items-center text-[10px] text-slate-500 font-medium bg-slate-50 px-2 py-0.5 rounded-full">
                                    <BookOpen size={10} className="mr-1" />
                                    {book.nuggets}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
