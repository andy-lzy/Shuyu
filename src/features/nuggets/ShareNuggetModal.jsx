import { useState } from 'react';
import { X, Share2, Copy, Check, Loader2, Twitter, MessageCircle, Mail } from 'lucide-react';
import { createShareLink } from '../../services/shareService';

export default function ShareNuggetModal({ isOpen, onClose, nugget }) {
    const [shareLink, setShareLink] = useState(null);
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState(null);

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

    const shareToSocial = (platform) => {
        if (!shareLink) return;
        const text = encodeURIComponent(`Check out this wisdom from "${nugget.content.substring(0, 50)}..."`);
        const url = encodeURIComponent(shareLink);

        let link = '';
        switch (platform) {
            case 'twitter':
                link = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
                break;
            case 'whatsapp':
                link = `https://wa.me/?text=${text}%20${url}`;
                break;
            case 'email':
                link = `mailto:?subject=Wisdom Shared via Shuyu&body=${text}%0A%0A${url}`;
                break;
        }
        window.open(link, '_blank');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-slide-up ring-1 ring-slate-900/5">
                {/* Header with Gradient */}
                <div className="px-6 py-5 bg-gradient-to-r from-slate-50 to-white border-b border-slate-100 flex justify-between items-center">
                    <div>
                        <h3 className="font-bold text-xl text-slate-800 flex items-center gap-2">
                            <Share2 size={22} className="text-primary" />
                            Share Wisdom
                        </h3>
                        <p className="text-xs text-slate-500 mt-1">Inspire others with this nugget</p>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {/* Nugget Preview */}
                    <div className="mb-8 p-5 bg-slate-50 rounded-xl border border-slate-100 relative group">
                        <div className="absolute top-3 left-3 text-primary/20">
                            <Share2 size={40} />
                        </div>
                        <p className="text-sm font-serif text-slate-700 italic leading-relaxed relative z-10 pl-2">
                            "{nugget.content.substring(0, 120)}{nugget.content.length > 120 ? '...' : ''}"
                        </p>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-lg text-sm text-rose-600 flex items-center gap-2">
                            <span className="font-bold">Error:</span> {error}
                        </div>
                    )}

                    {!shareLink ? (
                        <button
                            onClick={handleCreateLink}
                            disabled={loading}
                            className="w-full py-3.5 px-4 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin" size={20} />
                                    Generating Link...
                                </>
                            ) : (
                                <>
                                    <Share2 size={20} />
                                    Create Share Link
                                </>
                            )}
                        </button>
                    ) : (
                        <div className="space-y-6 animate-fade-in">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                                    Share Link
                                </label>
                                <div className="flex gap-2">
                                    <div className="flex-1 relative group">
                                        <input
                                            type="text"
                                            value={shareLink}
                                            readOnly
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono text-slate-600 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all pr-12"
                                            onClick={(e) => e.target.select()}
                                        />
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                                            <Share2 size={16} />
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleCopy}
                                        className={`px-4 py-3 rounded-xl font-medium transition-all shadow-sm flex items-center gap-2 ${copied
                                                ? 'bg-green-500 text-white shadow-green-500/25'
                                                : 'bg-slate-800 text-white hover:bg-slate-700 shadow-slate-800/25'
                                            }`}
                                    >
                                        {copied ? <Check size={20} /> : <Copy size={20} />}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                                    Share via
                                </label>
                                <div className="grid grid-cols-3 gap-3">
                                    <button
                                        onClick={() => shareToSocial('twitter')}
                                        className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-sky-50 text-slate-600 hover:text-sky-500 transition-colors border border-slate-100 hover:border-sky-200"
                                    >
                                        <Twitter size={24} />
                                        <span className="text-xs font-medium">Twitter</span>
                                    </button>
                                    <button
                                        onClick={() => shareToSocial('whatsapp')}
                                        className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-green-50 text-slate-600 hover:text-green-500 transition-colors border border-slate-100 hover:border-green-200"
                                    >
                                        <MessageCircle size={24} />
                                        <span className="text-xs font-medium">WhatsApp</span>
                                    </button>
                                    <button
                                        onClick={() => shareToSocial('email')}
                                        className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-purple-50 text-slate-600 hover:text-purple-500 transition-colors border border-slate-100 hover:border-purple-200"
                                    >
                                        <Mail size={24} />
                                        <span className="text-xs font-medium">Email</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
