import Link from 'next/link';

export function Header() {
    return (
        <header className="w-full py-3 px-4 sm:px-6 md:px-8 flex items-center justify-between border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50 h-16">
            <div className="flex items-center">
                <Link href="/" className="text-xl font-bold text-slate-50 tracking-tight">
                    Synta
                </Link>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
                <form action="/search" method="GET" className="relative group">
                    <button type="submit" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-white transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                    </button>
                    <input
                        type="text"
                        name="q"
                        placeholder="Search..."
                        className="bg-slate-900 border border-slate-800 text-slate-300 text-sm rounded-full py-2 pl-10 pr-4 focus:outline-none focus:border-slate-600 focus:bg-slate-950 w-32 sm:w-64 transition-all placeholder:text-slate-600"
                    />
                </form>
            </div>
        </header>
    );
}
