import { getErrorBySlug } from '@/app/actions/getErrorBySlug';
import { Header } from '@/components/Header';
import { AdSlot } from '@/components/AdSlot';
import { Metadata } from 'next';
import { Check, Terminal, Share2, ThumbsUp } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const data = await getErrorBySlug(slug);

    if (!data) return { title: 'Error Not Found - Synta' };

    return {
        title: `${data.aiSolution?.title || 'Error Fix'} | Synta`,
        description: data.aiSolution?.explanation?.substring(0, 160) || 'AI-generated fix for this programming error.',
    };
}

export default async function PublicErrorPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const data = await getErrorBySlug(slug);

    if (!data) {
        notFound();
    }

    const { aiSolution, rawError, language } = data;

    return (
        <div className="min-h-screen bg-slate-950 text-slate-50 font-sans">
            <Header />

            <main className="max-w-[1200px] mx-auto pt-8 pb-24 px-4 sm:px-6 flex flex-col lg:flex-row gap-12">

                {/* Main Content (Left Column) */}
                <div className="flex-1 min-w-0">

                    {/* Breadcrumbs */}
                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-6 uppercase tracking-wider font-semibold">
                        <Link href="/" className="hover:text-slate-300">Home</Link> /
                        <span className="text-blue-500">Solved Errors</span> /
                        <span className="truncate max-w-[200px]">{language || 'General'}</span>
                    </div>

                    <h1 className="text-3xl sm:text-4xl font-bold text-white mb-6 leading-tight">
                        {aiSolution?.title}
                    </h1>

                    <div className="flex items-center gap-4 text-sm text-slate-400 mb-8 border-b border-slate-800 pb-8">
                        <span className="flex items-center gap-1.5 px-2 py-1 bg-green-500/10 text-green-400 rounded">
                            <Check className="w-3.5 h-3.5" /> Verified Fix
                        </span>
                        <span>Updated {new Date(data.updatedAt).toLocaleDateString()}</span>
                    </div>

                    {/* Original Error Box */}
                    <div className="mb-10">
                        <h3 className="text-sm font-bold text-slate-400 uppercase mb-3 flex items-center gap-2">
                            <Terminal className="w-4 h-4" /> Error Log
                        </h3>
                        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 overflow-x-auto">
                            <pre className="text-sm font-mono text-slate-300 whitespace-pre-wrap">{rawError}</pre>
                        </div>
                    </div>

                    {/* Solution Content */}
                    <article className="prose prose-invert prose-slate max-w-none">
                        <h2>Explanation</h2>
                        <p className="text-lg text-slate-300 leading-relaxed">
                            {aiSolution?.explanation}
                        </p>

                        <div className="my-8">
                            <AdSlot position="content" />
                        </div>

                        <h2>Root Cause</h2>
                        <p>{aiSolution?.rootCause}</p>

                        <h2>Solution Steps</h2>
                        <ul>
                            {aiSolution?.steps?.map((step: string, i: number) => (
                                <li key={i}>{step}</li>
                            ))}
                        </ul>

                        <h2>Fixed Code</h2>
                        <div className="not-prose bg-[#0D1117] rounded-lg border border-slate-800 overflow-hidden my-6">
                            <div className="flex justify-between items-center px-4 py-2 bg-slate-900 border-b border-slate-800">
                                <span className="text-xs text-slate-500 font-mono">Solution.ts</span>
                                <button className="text-xs text-blue-400 hover:text-white">Copy Code</button>
                            </div>
                            <div className="p-4 overflow-x-auto">
                                <pre className="font-mono text-sm text-green-400">{aiSolution?.fixedCode}</pre>
                            </div>
                        </div>

                        <h2>Prevention Tips</h2>
                        <p>{aiSolution?.prevention}</p>
                    </article>

                    {/* Engagement Buttons */}
                    <div className="mt-12 flex gap-4">
                        <button className="flex items-center gap-2 px-6 py-2 bg-slate-900 text-slate-300 rounded-full hover:bg-slate-800 transition-colors border border-slate-800">
                            <ThumbsUp className="w-4 h-4" /> Helpful
                        </button>
                        <button className="flex items-center gap-2 px-6 py-2 bg-slate-900 text-slate-300 rounded-full hover:bg-slate-800 transition-colors border border-slate-800">
                            <Share2 className="w-4 h-4" /> Share
                        </button>
                    </div>

                </div>

                {/* Sidebar (Right Column) - Ads & Related */}
                <aside className="w-full lg:w-[320px] shrink-0 space-y-8">
                    <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-lg sticky top-24">
                        <h3 className="font-bold text-white mb-4">Try Synta AI</h3>
                        <p className="text-sm text-slate-400 mb-6">
                            Got a different error? Paste your stack trace and get an instant AI solution.
                        </p>
                        <Link href="/" className="block w-full text-center py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-md transition-colors shadow-lg shadow-blue-900/20">
                            Fix My Error
                        </Link>
                    </div>

                    <AdSlot position="sidebar" />
                </aside>

            </main>
        </div>
    );
}
