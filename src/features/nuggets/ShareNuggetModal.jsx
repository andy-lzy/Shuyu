import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Share2, Copy, Check, Loader2, Twitter, MessageCircle, Mail } from 'lucide-react';
import { createShareLink } from '../../services/shareService';

export default function ShareNuggetModal({ isOpen, onClose, nugget }) {
    const [shareLink, setShareLink] = useState(null);
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState(null);
    const { t } = useTranslation();

    const handleCreateLink = async () => {
        try {
            setLoading(true);
            setError(null);
            const share = await createShareLink(nugget.id);
            const link = `${window.location.origin}/share/${share.share_id}`;
            setShareLink(link);
        } catch (err) {
            console.error('Error creating share link:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(shareLink);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const handleClose = () => {
        setShareLink(null);
        setCopied(false);
        setError(null);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden animate-slide-up">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                        <Share2 size={20} className="text-primary" />
                        {t('share.title')}
                    </h3>
                    <button
                        onClick={handleClose}
                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6">
                    <div className="mb-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
                        <p className="text-sm font-serif text-slate-700 italic leading-relaxed">
                            "{nugget.content.substring(0, 100)}{nugget.content.length > 100 ? '...' : ''}"
                        </p>
                    </div>

                    {!shareLink ? (
                        <button
                            onClick={handleCreateLink}
                            disabled={loading}
                            className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all disabled:opacity-70"
                        >
                            {loading ? <Loader2 className="animate-spin" size={20} /> : <Share2 size={20} />}
                            {t('share.title')}
                        </button>
                    ) : (
                        <div className="space-y-4 animate-fade-in">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={shareLink}
                                    readOnly
                                    className="flex-1 p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-600 focus:outline-none"
                                />
                                <button
                                    onClick={handleCopy}
                                    className={`p-3 rounded-xl flex items-center justify-center transition-all ${copied ? 'bg-green-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                                >
                                    {copied ? <Check size={20} /> : <Copy size={20} />}
                                </button>
                            </div>

                            {copied && <p className="text-center text-xs text-green-600 font-bold">{t('share.copied')}</p>}

                            <div className="pt-4 border-t border-slate-100">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 text-center">{t('share.shareVia')}</p>
                                <div className="flex justify-center gap-4">
                                    <a
                                        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(nugget.content)}&url=${encodeURIComponent(shareLink)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-3 bg-sky-50 text-sky-500 rounded-full hover:bg-sky-100 transition-colors"
                                        title={t('share.twitter')}
                                    >
                                        <Twitter size={20} />
                                    </a>
                                    <a
                                        href={`https://wa.me/?text=${encodeURIComponent(nugget.content + ' ' + shareLink)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-3 bg-green-50 text-green-500 rounded-full hover:bg-green-100 transition-colors"
                                        title={t('share.whatsapp')}
                                    >
                                        <MessageCircle size={20} />
                                    </a>
                                    <a
                                        href={`mailto:?subject=Check out this nugget&body=${encodeURIComponent(nugget.content + '\n\n' + shareLink)}`}
                                        className="p-3 bg-indigo-50 text-indigo-500 rounded-full hover:bg-indigo-100 transition-colors"
                                        title={t('share.email')}
                                    >
                                        <Mail size={20} />
                                    </a>
                                </div>
                            </div>
                        </div>
                    )}

                    {error && (
                        <p className="mt-4 text-center text-sm text-rose-600 bg-rose-50 p-2 rounded-lg border border-rose-100">
                            {error}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
