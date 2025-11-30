import { useState } from 'react';
import { Share2, Heart, Copy, Quote, Book } from 'lucide-react';

export default function FocusPage() {
    const [activeNugget, setActiveNugget] = useState(0);

    // Mock data for nuggets
    const nuggets = [
        {
            id: 1,
            text: "The only true wisdom is in knowing you know nothing.",
            author: "Socrates",
            book: "The Republic",
            tags: ["Philosophy", "Wisdom"]
        },
        {
            id: 2,
            text: "You do not rise to the level of your goals. You fall to the level of your systems.",
            author: "James Clear",
            book: "Atomic Habits",
            tags: ["Productivity", "Habits"]
        },
        {
            id: 3,
            text: "Deep work is the ability to focus without distraction on a cognitively demanding task.",
            author: "Cal Newport",
            book: "Deep Work",
            tags: ["Focus", "Work"]
        }
    ];

    return (
        <div className="min-h-[85vh] flex flex-col justify-center py-6">
            <header className="px-6 mb-4">
                <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Daily Wisdom</h2>
            </header>

            {/* Carousel */}
            <div className="focus-carousel w-full">
                {nuggets.map((nugget, index) => (
                    <div key={nugget.id} className="focus-card snap-center">
                        <div className="absolute top-6 left-6 text-primary/20">
                            <Quote size={48} />
                        </div>

                        <div className="flex-1 flex flex-col justify-center z-10">
                            <p className="text-2xl md:text-3xl font-serif leading-relaxed text-slate-800 mb-6">
                                "{nugget.text}"
                            </p>

                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                                    {nugget.author.charAt(0)}
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-700">{nugget.author}</p>
                                    <p className="text-xs text-muted flex items-center">
                                        <Book size={10} className="mr-1" />
                                        {nugget.book}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-auto pt-6 border-t border-slate-100 flex justify-between items-center">
                            <div className="flex gap-2">
                                {nugget.tags.map(tag => (
                                    <span key={tag} className="text-[10px] px-2 py-1 bg-slate-50 text-slate-500 rounded-full font-medium border border-slate-100">
                                        #{tag}
                                    </span>
                                ))}
                            </div>

                            <div className="flex gap-3">
                                <button className="p-2 text-slate-400 hover:text-rose-500 transition-colors hover:bg-rose-50 rounded-full">
                                    <Heart size={20} />
                                </button>
                                <button className="p-2 text-slate-400 hover:text-primary transition-colors hover:bg-sky-50 rounded-full">
                                    <Share2 size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Indicators */}
            <div className="flex justify-center gap-2 mt-4">
                {nuggets.map((_, idx) => (
                    <div
                        key={idx}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === activeNugget ? 'bg-primary w-6' : 'bg-slate-300'
                            }`}
                    />
                ))}
            </div>
        </div>
    );
}
