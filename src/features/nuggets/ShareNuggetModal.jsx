import { useState } from 'react';
import { X, Share2, Copy, Check, Loader2 } from 'lucide-react';
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

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden animate-slide-up">
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                        <Share2 size={20} className="text-primary" />
                        Share Nugget
                    </h3>
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
                    <div className="mb-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
                        <p className="text-sm font-serif text-slate-700 italic leading-relaxed">
                            "{nugget.content.substring(0, 100)}{nugget.content.length > 100 ? '...' : ''}"
                        </p>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-lg text-sm text-rose-600">
                            {error}
                        </div>
                    )}

                    {!shareLink ? (
                        <button
                            onClick={handleCreateLink}
                            disabled={loading}
                            className="w-full py-3 px-4 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin" size={18} />
                                    Creating link...
                                </>
                            ) : (
                                <>
                                    <Share2 size={18} />
                                    Create Share Link
                                </>
                            )}
                        </button>
                    ) : (
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Share this link with anyone:
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={shareLink}
                                    readOnly
                                    className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-mono text-slate-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                    onClick={(e) => e.target.select()}
                                />
                                <button
                                    onClick={handleCopy}
                                    className={`px-4 py-3 rounded-lg font-medium transition-all ${copied
                                            ? 'bg-green-500 text-white'
                                            : 'bg-primary text-white hover:bg-primary/90'
                                        }`}
                                >
                                    {copied ? (
                                        <Check size={20} />
                                    ) : (
                                        <Copy size={20} />
                                    )}
                                </button>
                            </div>

                            {copied && (
                                <p className="mt-2 text-sm text-green-600 font-medium">
                                    ✓ Link copied to clipboard!
                                </p>
                            )}

                            <p className="mt-4 text-xs text-slate-500 text-center">
                                Anyone with this link can view and save this nugget to their library
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
