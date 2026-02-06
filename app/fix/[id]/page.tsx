import { getErrorResult } from '@/app/actions/getError';
import { Header } from '@/components/Header';
import { FixPageSkeleton } from '@/components/FixPageSkeleton';
import { Check, Copy, AlertTriangle, ShieldCheck, Terminal } from 'lucide-react';
import Link from 'next/link';

export default async function ErrorFixPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const data = await getErrorResult(id);

    if (!data) {
        return (
            <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col items-center justify-center p-4">
                <h1 className="text-2xl font-bold mb-4">Error Not Found</h1>
                <p className="text-slate-400 mb-8">This analysis session may have expired or is invalid.</p>
                <Link href="/" className="bg-blue-600 px-6 py-2 rounded-md hover:bg-blue-500 text-white">Return Home</Link>
            </div>
        );
    }

    const { aiSolution, rawError } = data;

    return (
        <div className="min-h-screen bg-slate-950 text-slate-50 font-sans">
            <Header />

            <main className="max-w-[900px] mx-auto pt-12 pb-24 px-4 sm:px-6">

                {/* Verification Section */}
                <section className="mb-12">
                    <h2 className="text-sm font-medium text-slate-400 mb-3 uppercase tracking-wider flex items-center gap-2">
                        <Terminal className="w-4 h-4" /> Original Error Input
                    </h2>
                    <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 overflow-hidden relative group">
                        <div className="absolute top-0 left-0 w-1 h-full bg-red-500/50"></div>
                        <pre className="text-xs sm:text-sm font-mono text-slate-300 whitespace-pre-wrap break-all max-h-[220px] overflow-y-auto custom-scrollbar">
                            {rawError}
                        </pre>
                    </div>
                </section>

                {/* AI Processing Steps (Fake Completed State) */}
                <div className="flex gap-4 mb-12 text-sm font-mono text-green-500 bg-green-500/5 border border-green-500/10 p-4 rounded-md">
                    <div className="flex items-center gap-2">
                        <Check className="w-4 h-4" /> Stack Trace Analyzed
                    </div>
                    <div className="hidden sm:flex items-center gap-2">
                        <Check className="w-4 h-4" /> Root Cause Identified
                    </div>
                    <div className="hidden sm:flex items-center gap-2">
                        <Check className="w-4 h-4" /> Solution Generated
                    </div>
                </div>

                {/* Solution Container */}
                <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">

                    {/* 1. Explanation */}
                    <section>
                        <div className="flex items-center gap-2 mb-3">
                            <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 text-xs font-bold uppercase tracking-widest rounded">Concept</span>
                        </div>
                        <p className="text-lg text-slate-200 leading-relaxed">
                            {aiSolution?.explanation || "Analysis complete."}
                        </p>
                    </section>

                    {/* 2. Root Cause */}
                    <section className="bg-slate-900/30 border border-slate-800 p-6 rounded-lg">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-yellow-500" /> Root Cause
                        </h3>
                        <div className="text-slate-300 leading-relaxed">
                            {aiSolution?.rootCause}
                        </div>
                    </section>

                    {/* 3. Steps */}
                    <section>
                        <h3 className="text-lg font-bold text-white mb-6">Resolution Steps</h3>
                        <ol className="space-y-6">
                            {aiSolution?.steps?.map((step: string, i: number) => (
                                <li key={i} className="flex gap-4">
                                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center font-bold text-sm border border-slate-700">
                                        {i + 1}
                                    </span>
                                    <p className="text-slate-300 pt-1 leading-relaxed">{step}</p>
                                </li>
                            ))}
                        </ol>
                    </section>

                    {/* 4. Corrected Code */}
                    <section>
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-lg font-bold text-white">Patched Code</h3>
                            <span className="text-xs text-slate-500 font-mono bg-slate-900 px-2 py-1 rounded">Auto-detected</span>
                        </div>
                        <div className="bg-[#0D1117] rounded-lg border border-slate-700 overflow-hidden shadow-2xl">
                            <div className="flex justify-between items-center px-4 py-2 bg-slate-800/50 border-b border-slate-700/50">
                                <div className="flex gap-1.5">
                                    <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
                                </div>
                                <button className="text-xs flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors">
                                    <Copy className="w-3.5 h-3.5" /> Copy
                                </button>
                            </div>
                            <div className="p-4 overflow-x-auto">
                                <pre className="font-mono text-sm text-green-400">
                                    {aiSolution?.fixedCode}
                                </pre>
                            </div>
                        </div>
                    </section>

                    {/* 5. Prevention */}
                    <section className="bg-blue-500/5 border border-blue-500/10 p-6 rounded-lg flex gap-4">
                        <ShieldCheck className="w-6 h-6 text-blue-400 flex-shrink-0" />
                        <div>
                            <h4 className="font-bold text-blue-400 text-sm uppercase tracking-wider mb-1">Prevention</h4>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                {aiSolution?.prevention}
                            </p>
                        </div>
                    </section>

                </div>

            </main>

            {/* Sticky Feedback Bar */}
            <div className="fixed bottom-0 left-0 w-full bg-slate-900 border-t border-slate-800 py-4 px-6 z-40 animate-in slide-in-from-bottom-full duration-1000 delay-1000 fill-mode-forwards">
                <div className="max-w-[900px] mx-auto flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-300 hidden sm:inline">Did this fix your issue?</span>
                    <div className="flex gap-4 w-full sm:w-auto justify-center">
                        <button className="text-sm text-slate-500 hover:text-white px-4 py-2 transition-colors">No, still broken</button>
                        <button className="text-sm bg-green-600 hover:bg-green-500 text-white px-6 py-2 rounded-md font-medium shadow-lg shadow-green-900/20 transition-all active:scale-95">
                            Yes, it worked
                        </button>
                    </div>
                </div>
            </div>

        </div>
    );
}
