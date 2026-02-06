'use client';

import { validateErrorInput } from '@/lib/validateError';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export function ErrorInput() {
    const router = useRouter();
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async () => {
        setError('');

        const validation = validateErrorInput(input);
        if (!validation.valid) {
            setError(validation.message || 'Invalid input');
            return;
        }

        setLoading(true);

        try {
            const res = await fetch('/api/fix-error', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ errorLog: input }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Something went wrong');
            }

            if (data.redirectUrl) {
                router.push(data.redirectUrl);
            }
        } catch (err: any) {
            setError(err.message);
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-3xl mx-auto">
            <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition duration-700"></div>
                <div className="relative bg-[#0F172A] rounded-lg border border-slate-700 shadow-xl overflow-hidden">
                    {/* Terminal Header Decoration */}
                    <div className="flex items-center gap-1.5 px-4 py-2 border-b border-slate-800 bg-slate-900/50">
                        <div className="w-3 h-3 rounded-full bg-slate-700"></div>
                        <div className="w-3 h-3 rounded-full bg-slate-700"></div>
                        <div className="w-3 h-3 rounded-full bg-slate-700"></div>
                        <span className="ml-2 text-xs text-slate-500 font-mono">error.log</span>
                    </div>
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Paste your stack trace or error message here..."
                        className="w-full h-40 sm:h-52 bg-[#0F172A] text-slate-300 font-mono text-sm p-4 focus:outline-none resize-none placeholder:text-slate-600 leading-relaxed"
                        spellCheck={false}
                    />
                </div>
            </div>

            <div className="h-6 mt-2">
                {error && (
                    <p className="text-red-400 text-xs sm:text-sm flex items-center gap-1 animate-in fade-in slide-in-from-top-1">
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500" /> {error}
                    </p>
                )}
            </div>

            <div className="mt-4 flex flex-col sm:flex-row justify-center items-center gap-4">
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 px-8 rounded-md shadow-lg shadow-blue-900/20 transition-all active:scale-95 disabled:opacity-70 disabled:pointer-events-none flex justify-center items-center gap-2"
                >
                    {loading ? (
                        <>
                            <Loader2 className="animate-spin w-4 h-4" />
                            <span>Analyzing...</span>
                        </>
                    ) : (
                        'Fix with AI'
                    )}
                </button>
            </div>
        </div>
    );
}
