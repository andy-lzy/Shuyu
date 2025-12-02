import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { BookOpen, Loader2, Download, CheckCircle, AlertCircle, LogIn } from 'lucide-react';
import { getSharedNugget, saveSharedNugget } from '../../services/shareService';
import { supabase } from '../../lib/supabase';

export default function SharedNuggetPage() {
    const { shareId } = useParams();
    const navigate = useNavigate();

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        checkUser();
        loadSharedNugget();
    }, [shareId]);

    const checkUser = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
    };

    const loadSharedNugget = async () => {
        try {
            setLoading(true);
            const sharedData = await getSharedNugget(shareId);
            setData(sharedData);
        } catch (err) {
            console.error('Error loading shared nugget:', err);
            setError('This shared nugget could not be found. It may have been deleted.');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!user) {
            // Redirect to login with return URL
            navigate('/auth?mode=signup', { state: { returnUrl: `/share/${shareId}` } });
            return;
        }

        try {
            setSaving(true);
            await saveSharedNugget(shareId);
            setSaved(true);
            // Optional: navigate to library after delay
            setTimeout(() => {
                navigate(`/library`);
            }, 2000);
        } catch (err) {
            console.error('Error saving nugget:', err);
            if (err.message.includes('already have')) {
                setSaved(true); // Treat as success but maybe show different message
            } else {
                alert('Failed to save nugget: ' + err.message);
            }
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Loader2 className="animate-spin text-primary" size={32} />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-slate-50">
                <AlertCircle className="text-rose-400 mb-4" size={48} />
                <h2 className="text-xl font-bold text-slate-800 mb-2 text-center">Nugget Not Found</h2>
                <p className="text-slate-600 text-center mb-6 max-w-md">{error}</p>
                <Link to="/" className="btn-primary">
                    Go Home
                </Link>
            </div>
        );
    }

    const { nugget, book } = data;

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 flex flex-col items-center">
            {/* Logo / Brand */}
            <div className="mb-8 font-serif text-2xl font-bold text-primary flex items-center gap-2">
                <BookOpen size={28} />
                Shuyu
            </div>

            <div className="w-full max-w-2xl">
                {/* Nugget Card */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8 animate-slide-up">
                    <div className="p-8 md:p-12">
                        <div className="mb-8">
                            <span className="text-6xl text-primary/20 font-serif leading-none">"</span>
                            <p className="text-xl md:text-2xl text-slate-800 font-serif leading-relaxed -mt-6 relative z-10">
                                {nugget.content}
                            </p>
                        </div>

                        {nugget.note && (
                            <div className="mb-8 p-4 bg-slate-50 rounded-xl border border-slate-100 text-slate-600 italic">
                                💭 {nugget.note}
                            </div>
                        )}

                        <div className="flex flex-wrap gap-2 mb-8">
                            {nugget.tags && nugget.tags.map(tag => (
                                <span key={tag} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                                    #{tag}
                                </span>
                            ))}
                            {nugget.page_number && (
                                <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-sm font-medium">
                                    Page {nugget.page_number}
                                </span>
                            )}
                        </div>

                        {/* Book Info */}
                        <div className="flex items-center gap-4 pt-8 border-t border-slate-100">
                            <div className="w-16 h-24 bg-slate-200 rounded shadow-sm overflow-hidden flex-shrink-0">
                                {book.cover_url ? (
                                    <img src={book.cover_url} alt={book.title} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-slate-300">
                                        <BookOpen className="text-slate-400" size={24} />
                                    </div>
                                )}
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 leading-tight mb-1">{book.title}</h3>
                                <p className="text-slate-600 text-sm mb-1">by {book.author}</p>
                                <div className="text-xs text-slate-400 flex gap-2">
                                    {book.published_date && <span>{book.published_date.split('-')[0]}</span>}
                                    {book.publisher && <span>• {book.publisher}</span>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Section */}
                <div className="text-center animate-fade-in delay-200">
                    {saved ? (
                        <div className="bg-green-50 border border-green-200 rounded-xl p-6 inline-block w-full max-w-md">
                            <div className="flex flex-col items-center gap-2 text-green-700">
                                <CheckCircle size={32} />
                                <h3 className="font-bold text-lg">Saved to Library!</h3>
                                <p className="text-sm opacity-90">Redirecting you to your library...</p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-4">
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="w-full max-w-md py-4 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-lg"
                            >
                                {saving ? (
                                    <Loader2 className="animate-spin" size={24} />
                                ) : user ? (
                                    <Download size={24} />
                                ) : (
                                    <LogIn size={24} />
                                )}
                                {user ? 'Save to My Library' : 'Login to Save'}
                            </button>

                            {!user && (
                                <p className="text-slate-500 text-sm">
                                    New to Shuyu? <Link to="/auth?mode=signup" className="text-primary font-medium hover:underline">Create an account</Link> to start collecting wisdom.
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
