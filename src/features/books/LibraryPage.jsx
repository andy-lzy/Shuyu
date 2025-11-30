export default function LibraryPage() {
    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">Library</h1>
            <div className="masonry-grid">
                <div className="card h-40 bg-slate-100 flex items-center justify-center">Book 1</div>
                <div className="card h-64 bg-slate-100 flex items-center justify-center">Book 2</div>
                <div className="card h-48 bg-slate-100 flex items-center justify-center">Book 3</div>
            </div>
        </div>
    );
}
