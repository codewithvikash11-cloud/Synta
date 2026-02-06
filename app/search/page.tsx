import { searchErrors } from '@/app/actions/search';
import { Header } from '@/components/Header';
import { Search, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q: string }> }) {
    const { q } = await searchParams;
    const results = await searchErrors(q || '');

    return (
        <div className="min-h-screen bg-slate-950 text-slate-50 font-sans">
            <Header />

            <main className="max-w-4xl mx-auto pt-12 pb-24 px-4 sm:px-6">
                <h1 className="text-2xl font-bold mb-2 text-white">Search Results</h1>
                <p className="text-slate-400 mb-8">
                    Showing results for <span className="text-slate-200 font-mono">"{q}"</span>
                </p>

                {results.length === 0 ? (
                    <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-12 text-center">
                        <Search className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-slate-300 mb-2">No fixes found</h3>
                        <p className="text-slate-500 max-w-sm mx-auto">
                            We couldn't find a matching error in our database. Try pasting your error directly on the homepage.
                        </p>
                        <Link href="/" className="inline-block mt-6 px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-md transition-colors">
                            Go to Homepage
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {results.map((result: any) => (
                            <Link
                                key={result._id}
                                href={`/error/${result.formattedSlug || result._id}`}
                                className="block bg-slate-900 border border-slate-800 rounded-lg p-5 hover:border-blue-500/50 transition-colors group"
                            >
                                <h2 className="text-lg font-semibold text-blue-400 mb-2 group-hover:text-blue-300">
                                    {result.aiSolution?.title || 'Unknown Error Fix'}
                                </h2>
                                <p className="text-sm font-mono text-slate-500 truncate mb-4 bg-slate-950 p-2 rounded border border-slate-900">
                                    {result.rawError}
                                </p>
                                <div className="flex items-center text-xs text-slate-400 font-medium">
                                    <span>Read Solution</span>
                                    <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
