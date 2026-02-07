import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import ReviewForm from '@/components/ReviewForm';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getErrorData(id: string) {
    const baseUrl = process.env.NEXT_PUBLIC_ADMIN_BASE_URL || 'http://localhost:3000';
    try {
        const res = await fetch(`${baseUrl}/api/errors/${id}`, {
            cache: 'no-store',
            next: { revalidate: 0 }
        });

        if (!res.ok) return null;
        return res.json();
    } catch (error) {
        return null;
    }
}

export default async function ErrorReviewPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const data = await getErrorData(id);

    if (!data || !data.error) {
        notFound();
    }

    const { error, duplicate } = data;

    return (
        <div className="h-screen flex flex-col bg-slate-950">
            <header className="h-14 border-b border-slate-800 bg-slate-900 flex items-center px-4 justify-between shrink-0">
                <div className="flex items-center gap-4">
                    <Link href="/errors" className="text-slate-400 hover:text-white transition-colors">
                        <ChevronLeft className="w-5 h-5" />
                    </Link>
                    <h1 className="text-sm font-bold text-white uppercase tracking-wider">
                        Review Error <span className="text-slate-500">#{id.slice(-6)}</span>
                    </h1>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${error.status === 'PUBLISHED' ? 'bg-green-500/10 text-green-500' :
                        error.status === 'REJECTED' ? 'bg-red-500/10 text-red-500' : 'bg-yellow-500/10 text-yellow-500'
                        }`}>
                        {error.status}
                    </span>
                </div>
                <div className="text-xs text-slate-500">
                    Created {new Date(error.createdAt).toLocaleString()}
                </div>
            </header>

            <div className="flex-1 overflow-hidden flex">
                {/* LEFT: Read-Only Original Error */}
                <div className="w-1/3 border-r border-slate-800 bg-slate-950 flex flex-col">
                    <div className="p-4 border-b border-slate-800 bg-slate-900/50">
                        <h2 className="text-xs font-bold text-slate-400 uppercase">Original Error Log</h2>
                    </div>
                    <div className="flex-1 overflow-auto p-4">
                        <pre className="text-xs font-mono text-red-300 bg-slate-900/50 p-4 rounded border border-red-500/10 whitespace-pre-wrap break-all">
                            {error.rawError}
                        </pre>
                    </div>
                </div>

                {/* RIGHT: Editable Form */}
                <div className="w-2/3 bg-slate-900 flex flex-col">
                    <ReviewForm error={error} duplicate={duplicate} />
                </div>
            </div>
        </div>
    );
}
