export default function FocusPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] p-6">
            <div className="focus-card w-full">
                <h2 className="text-2xl font-bold mb-4 text-primary">Daily Wisdom</h2>
                <p className="text-xl font-serif italic text-slate-600">
                    "The only true wisdom is in knowing you know nothing."
                </p>
                <p className="mt-4 text-sm text-slate-400 uppercase tracking-wider font-bold">
                    - Socrates
                </p>
            </div>
        </div>
    );
}
