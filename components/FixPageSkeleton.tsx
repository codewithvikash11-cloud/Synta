export function FixPageSkeleton() {
    return (
        <div className="max-w-4xl mx-auto px-4 py-12 animate-pulse">
            <div className="h-8 bg-slate-800 rounded w-1/3 mb-8 mx-auto"></div>

            <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 mb-8 h-48"></div>

            <div className="space-y-4 mb-12">
                <div className="h-4 bg-slate-800 rounded w-1/4"></div>
                <div className="h-4 bg-slate-800 rounded w-1/2"></div>
                <div className="h-4 bg-slate-800 rounded w-1/3"></div>
            </div>

            <div className="h-64 bg-slate-800 rounded-lg"></div>
        </div>
    );
}
