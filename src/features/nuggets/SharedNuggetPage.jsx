import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getSharedNugget, saveSharedNugget } from '../../services/shareService';
import { Quote, BookOpen, Download, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function SharedNuggetPage() {
    const { shareId } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        loadSharedNugget();
    }, [shareId]);

    async function loadSharedNugget() {
        try {
            setLoading(true);
            const result = await getSharedNugget(shareId);
            setData(result);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    const handleSave = async () => {
        if (!user) {
            // Redirect to login with return URL
            navigate('/auth', { state: { returnUrl: `/share/${shareId}` } });
            return;
        }

        try {
            setSaving(true);
            await saveSharedNugget(shareId);
            setSaved(true);
            setTimeout(() => {
                navigate('/library');
            }, 2000);
        } catch (err) {
            alert(t('common.error') + ': ' + err.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Loader2 className="animate-spin text-slate-400" size={32} />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
                <div className="w-16 h-16 bg-rose-100 text-rose-500 rounded-full flex items-center justify-center mb-4">
                    <AlertCircle size={32} />
                </div>
                <h1 className="text-xl font-bold text-slate-800 mb-2">{t('common.error')}</h1>
                <p className="text-slate-500 mb-6">{error}</p>
                <Link to="/" className="text-primary font-bold hover:underline">{t('common.back')}</Link>
            </div>
        );
    }

    if (!data) return null;

    const { nugget, book } = data;

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            {/* Header */}
            <header className="bg-white border-b border-slate-100 py-4 px-6 flex justify-between items-center sticky top-0 z-10">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white font-serif font-bold">
                        S
                    </div>
                    <span className="font-bold text-slate-800">{t('sharedPage.appTitle')}</span>
                </div>
                {!user && (
                    <Link to="/auth" className="text-sm font-bold text-slate-600 hover:text-slate-900">
                        {t('auth.signIn')}
                    </Link>
                )}
            </header>

            {/* Main Content */}
            <main className="flex-1 flex flex-col items-center justify-center p-6">
                <div className="w-full max-w-md">
                    {/* Nugget Card */}
                    <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 overflow-hidden mb-8 animate-slide-up">
                        <div className="p-8 md:p-10 relative">
                            <Quote className="text-primary/10 absolute top-6 left-6" size={64} />
                            <div className="relative z-10">
                                <p className="font-serif text-2xl text-slate-800 leading-relaxed mb-8">
                                    "{nugget.content}"
                                </p>

                                <div className="flex items-center gap-4 pt-8 border-t border-slate-50">
                                    <div className="w-12 h-16 bg-slate-200 rounded shadow-sm overflow-hidden flex-shrink-0">
                                        {book.cover_url ? (
                                            <img src={book.cover_url} alt={book.title} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-300">
                                                <BookOpen size={20} />
                                            </div>
                                        )}
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="font-bold text-slate-800 truncate">{book.title}</h3>
                                        <p className="text-sm text-slate-500 truncate">{book.author}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Button */}
                    <button
                        onClick={handleSave}
                        disabled={saving || saved}
                        className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all flex items-center justify-center gap-2 ${saved
                                ? 'bg-green-500 text-white shadow-green-500/20'
                                : 'bg-slate-900 text-white shadow-slate-900/20 hover:scale-[1.02] active:scale-[0.98]'
                            }`}
                    >
                        {saving ? (
                            <>
                                <Loader2 className="animate-spin" />
                                {t('sharedPage.saving')}
                            </>
                        ) : saved ? (
                            <>
                                <CheckCircle2 />
                                {t('sharedPage.saved')}
                            </>
                        ) : (
                            <>
                                <Download size={20} />
                                {user ? t('sharedPage.saveToLibrary') : t('sharedPage.loginToSave')}
                            </>
                        )}
                    </button>

                    <p className="text-center text-slate-400 text-sm mt-6">
                        {t('sharedPage.appSubtitle')}
                    </p>
                </div>
            </main>
        </div>
    );
}
