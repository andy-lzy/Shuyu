import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getRandomNugget } from '../../services/nuggetService';
import { Quote, RefreshCw, Share2, Heart, BookOpen, Loader2 } from 'lucide-react';
import ShareNuggetModal from './ShareNuggetModal';

export default function FocusPage() {
    const [nugget, setNugget] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [shareModalOpen, setShareModalOpen] = useState(false);
    const { t } = useTranslation();

    useEffect(() => {
        loadRandomNugget();
    }, []);

    async function loadRandomNugget() {
        try {
            setLoading(true);
            const data = await getRandomNugget();
            setNugget(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center">
                <Loader2 className="animate-spin text-slate-300 mb-4" size={48} />
                <p className="text-slate-400 font-medium animate-pulse">{t('common.loading')}</p>
            </div>
        );
    }

    if (!nugget) {
        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-6">
                <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6 text-slate-300">
                    <BookOpen size={48} />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">{t('focus.empty')}</h2>
                <p className="text-slate-500 max-w-xs mx-auto">{t('library.addFirst')}</p>
            </div>
        );
    }

    return (
        <div className="min-h-[85vh] flex flex-col justify-center px-6 py-8 relative">
            <div className="absolute top-8 left-6">
                <h1 className="text-3xl font-bold text-slate-800">{t('focus.title')}</h1>
                <p className="text-slate-500 mt-1">{t('focus.subtitle')}</p>
            </div>

            <div className="w-full max-w-md mx-auto">
                <div className="relative bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-8 md:p-12 border border-slate-100">
                    <Quote className="text-primary/20 absolute top-8 left-8" size={48} />

                    <div className="relative z-10 my-6">
                        <p className="font-serif text-2xl md:text-3xl text-slate-800 leading-relaxed">
                            "{nugget.content}"
                        </p>
                    </div>

                    <div className="mt-8 pt-8 border-t border-slate-50 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center overflow-hidden">
                                {nugget.book?.cover_url ? (
                                    <img src={nugget.book.cover_url} alt={nugget.book.title} className="w-full h-full object-cover" />
                                ) : (
                                    <BookOpen size={16} className="text-slate-400" />
                                )}
                            </div>
                            <div>
                                <p className="font-bold text-sm text-slate-800 line-clamp-1">{nugget.book?.title}</p>
                                <p className="text-xs text-slate-500 line-clamp-1">{nugget.book?.author}</p>
                            </div>
                        </div>

                        {nugget.page_number && (
                            <span className="text-xs font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-md">
                                P. {nugget.page_number}
                            </span>
                        )}
                    </div>
                </div>

                {/* Action Bar */}
                <div className="flex justify-center gap-6 mt-12">
                    <button
                        onClick={() => setShareModalOpen(true)}
                        className="p-4 bg-white text-slate-600 rounded-full shadow-lg shadow-slate-200/50 hover:text-primary hover:scale-110 transition-all"
                        title={t('focus.share')}
                    >
                        <Share2 size={24} />
                    </button>

                    <button
                        onClick={loadRandomNugget}
                        className="p-6 bg-slate-900 text-white rounded-full shadow-xl shadow-slate-900/20 hover:scale-105 active:scale-95 transition-all"
                        title="Next Nugget"
                    >
                        <RefreshCw size={32} />
                    </button>

                    <button
                        className="p-4 bg-white text-slate-600 rounded-full shadow-lg shadow-slate-200/50 hover:text-rose-500 hover:scale-110 transition-all"
                        title={t('focus.favorite')}
                    >
                        <Heart size={24} />
                    </button>
                </div>
            </div>

            <ShareNuggetModal
                isOpen={shareModalOpen}
                onClose={() => setShareModalOpen(false)}
                nugget={nugget}
            />
        </div>
    );
}
