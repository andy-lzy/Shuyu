import { useState, useEffect } from 'react';
import { Share2, Heart, Quote, Book, Plus, Loader2, Sparkles } from 'lucide-react';
import { getNuggets, toggleFavorite } from '../../services/nuggetService';
import CreateNuggetModal from './CreateNuggetModal';

export default function FocusPage() {
    const [nuggets, setNuggets] = useState([]);
    const [activeNugget, setActiveNugget] = useState(0);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        loadNuggets();
    }, []);

    const loadNuggets = async () => {
        try {
            setLoading(true);
            const data = await getNuggets();
            setNuggets(data);
        } catch (error) {
            console.error('Error loading nuggets:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFavorite = async (nugget) => {
        try {
            // Optimistic update
            const updatedNuggets = nuggets.map(n =>
                n.id === nugget.id ? { ...n, is_favorite: !n.is_favorite } : n
            );
            setNuggets(updatedNuggets);

            await toggleFavorite(nugget.id, nugget.is_favorite);
        } catch (error) {
            console.error('Error toggling favorite:', error);
            // Revert on error
            loadNuggets();
        }
    };

    const handleScroll = (e) => {
        const scrollPosition = e.target.scrollLeft;
        const cardWidth = e.target.offsetWidth;
        const newIndex = Math.round(scrollPosition / cardWidth);
        setActiveNugget(newIndex);
    };

    return (
        <div className="min-h-[85vh] flex flex-col justify-center py-6 relative">
            <header className="px-6 mb-4 flex justify-between items-center">
                <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Daily Wisdom</h2>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="p-2 bg-primary/10 text-primary rounded-full hover:bg-primary/20 transition-colors"
                >
                    <Plus size={20} />
                </button>
            </header>

            {loading ? (
                <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                    <Loader2 className="animate-spin mb-2" size={32} />
                    <p>Loading wisdom...</p>
                </div>
            ) : nuggets.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
                    <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6 text-slate-300">
                        <Sparkles size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">No nuggets yet</h3>
                    <p className="text-muted mb-8">
                        Capture your first nugget of wisdom from your reading journey.
                    </p>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="btn-primary flex items-center gap-2"
                    >
                        <Plus size={18} />
                        Create First Nugget
                    </button>
                </div>
            ) : (
                <>
                    {/* Carousel */}
                    <div
                        className="focus-carousel w-full overflow-x-auto snap-x snap-mandatory flex scrollbar-hide"
                        onScroll={handleScroll}
                    >
                        {nuggets.map((nugget) => (
                            <div key={nugget.id} className="focus-card snap-center flex-shrink-0 w-full px-6">
                                <div className="h-full bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-8 relative flex flex-col border border-slate-100">
                                    <div className="absolute top-6 left-6 text-primary/20">
                                        <Quote size={48} />
                                    </div>

                                    <div className="flex-1 flex flex-col justify-center z-10">
                                        <p className="text-2xl md:text-3xl font-serif leading-relaxed text-slate-800 mb-6">
                                            "{nugget.content}"
                                        </p>

                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-sm font-bold text-slate-600 overflow-hidden">
                                                {nugget.books?.cover_url ? (
                                                    <img src={nugget.books.cover_url} alt={nugget.books.title} className="w-full h-full object-cover" />
                                                ) : (
                                                    nugget.books?.author?.charAt(0) || '?'
                                                )}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-700">
                                                    {nugget.books?.author || 'Unknown Author'}
                                                </p>
                                                <p className="text-xs text-muted flex items-center">
                                                    <Book size={10} className="mr-1" />
                                                    {nugget.books?.title || 'Unknown Book'}
                                                    {nugget.page_number && ` • p.${nugget.page_number}`}
                                                </p>
                                            </div>
                                        </div>

                                        {nugget.note && (
                                            <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-100">
                                                <p className="text-sm text-slate-600 italic">
                                                    "{nugget.note}"
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-auto pt-6 border-t border-slate-100 flex justify-between items-center">
                                        <div className="flex gap-2 flex-wrap">
                                            {nugget.tags && nugget.tags.map(tag => (
                                                <span key={tag} className="text-[10px] px-2 py-1 bg-slate-50 text-slate-500 rounded-full font-medium border border-slate-100">
                                                    #{tag}
                                                </span>
                                            ))}
                                        </div>

                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => handleFavorite(nugget)}
                                                className={`p-2 transition-colors rounded-full ${nugget.is_favorite
                                                        ? 'text-rose-500 bg-rose-50'
                                                        : 'text-slate-400 hover:text-rose-500 hover:bg-rose-50'
                                                    }`}
                                            >
                                                <Heart size={20} fill={nugget.is_favorite ? "currentColor" : "none"} />
                                            </button>
                                            <button className="p-2 text-slate-400 hover:text-primary transition-colors hover:bg-sky-50 rounded-full">
                                                <Share2 size={20} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Indicators */}
                    <div className="flex justify-center gap-2 mt-6">
                        {nuggets.map((_, idx) => (
                            <div
                                key={idx}
                                className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === activeNugget ? 'bg-primary w-6' : 'bg-slate-300'
                                    }`}
                            />
                        ))}
                    </div>
                </>
            )}

            <CreateNuggetModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onNuggetCreated={loadNuggets}
            />
        </div>
    );
}
